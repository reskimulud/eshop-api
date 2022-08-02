const { nanoid } = require('nanoid');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { imageUrlGenerator } = require('../../utils');

class ProductsService {
  #database;

  constructor(database) {
    this.#database = database;
  }

  async #verifyUserRole(userId) {
    const query = `SELECT role FROM users WHERE id = '${userId}'`;

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows < 1) {
      throw new NotFoundError('User tidak ditemukan');
    }

    const role = result[0].role;

    if (role !== 'admin') {
      throw new AuthorizationError('Anda tidak berhak melakukan ini');
    }
  }

  async addProduct(userId, title, price, categoryId, description) {
    await this.#verifyUserRole(userId);
    const id = `product-${nanoid(16)}`;
    const createdAt = new Date().getTime();
    const updatedAt = createdAt;
    const query = `INSERT INTO products (id, title, price, categoryId, createdAt, updatedAt, description, image)
      VALUES (
        '${id}',
        '${title}',
        ${price},
        '${categoryId}',
        ${createdAt},
        ${updatedAt},
        '${description}',
        NULL
      )`;

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows  < 1) {
      throw new InvariantError('Gagal menambahkan produk')
    }

    return id;
  }

  async getAllProducts() {
    const query = `SELECT products.id, products.title,
                      products.price, products.description,
                      products.image, categories.name as category
                    FROM products JOIN categories
                    ON products.categoryId = categories.id
                    ORDER BY products.updatedAt DESC`;

    const result = await this.#database.query(query);

    const products = result.map((product) => {
      if (product.image !== null) {
        product.image = imageUrlGenerator(product.image);
      }

      return product;
    });

    return products;
  }

  async getProductById(id) {
    const query = `SELECT products.*, categories.name as category
                    FROM products JOIN categories
                    ON products.categoryId = categories.id
                    WHERE products.id = '${id}'`;

    const result = await this.#database.query(query);

    if(!result || result.length < 1 || result.affectedRows < 1) {
      throw new NotFoundError('Produk tidak ditemukan');
    }

    const product = result[0];

    if (product.image !== null) {
      product.image = imageUrlGenerator(product.image);
    }

    return product;
  }

  async updateProductById(id, userId, {title, price, categoryId, description}) {
    await this.#verifyUserRole(userId);
    const queryProduct = `SELECT id FROM products WHERE id = '${id}'`;

    const product = await this.#database.query(queryProduct);

    if (!product || product.length < 1 || product.affectedRows < 1) {
      throw new NotFoundError('Produk tidak ditemukan');
    }

    const updatedAt = new Date().getTime();
    const query = `UPDATE products SET 
        title = '${title}',
        price = ${price},
        categoryId = '${categoryId}',
        updatedAt = ${updatedAt},
        description = '${description}'
      WHERE id = '${id}'`;

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows < 1) {
      throw new InvariantError('Gagal memperbarui produk');
    }
  }

  async deleteProductById(id, userId) {
    await this.#verifyUserRole(userId);
    const query = `DELETE FROM products WHERE id = '${id}'`;

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows < 1) {
      throw new NotFoundError('Gagal menghapus produk, id tidak ditemukan');
    }
  }

  async updateProductImageById(id, filename) {
    const oldFileName = await this.#database.query(
        `SELECT image FROM products WHERE id = '${id}'`,
    );

    const queryProduct = `SELECT id FROM products WHERE id = '${id}'`;

    const product = await this.#database.query(queryProduct);

    if (!product || product.length < 1 || product.affectedRows < 1) {
      throw new NotFoundError('Produk tidak ditemukan');
    }

    const query = `UPDATE products SET image = '${filename}' WHERE id = '${id}'`;

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows < 1) {
      throw new InvariantError('Gambar produk gagal diperbarui');
    }

    return oldFileName[0].image;
  }

  async addCategory(name, userId) {
    await this.#verifyUserRole(userId);
    const id = `category-${nanoid(16)}`;
    const query = `INSERT INTO categories VALUES (
        '${id}',
        '${name}'
    )`

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows < 1) {
      throw new InvariantError('Gagal menambahkan kategori');
    }

    return id;
  }

  async getCategories() {
    const query = 'SELECT * FROM categories ORDER BY name ASC';

    const result = await this.#database.query(query);

    return result;
  }

  async getProductsByCategoryId(categoryId) {
    const queryCategory = `SELECT name FROM categories WHERE id = '${categoryId}'`
    const category = await this.#database.query(queryCategory);
    if (!category || category.length < 1) {
      throw new NotFoundError('Gagal mengambil data, kategori tidak ditemukan');
    }

    const query = `SELECT products.id, products.title,
                      products.price, products.description,
                      products.image, categories.name as category
                    FROM products JOIN categories
                    ON products.categoryId = categories.id
                    WHERE products.categoryId = '${categoryId}'`;

    const products = await this.#database.query(query);
    const categoryName = category[0].name;

    return { categoryName, products };
  }

  async updateCategoryById(id, name, userId) {
    await this.#verifyUserRole(userId);
    const query = `UPDATE categories
        SET name = '${name}'
        WHERE id = '${id}'`;

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows < 1) {
      throw new NotFoundError('Gagal memperbarui, kategori tidak ditemukan');
    }
  }

  async deleteCategoryById(id, userId) {
    await this.#verifyUserRole(userId);
    const query = `DELETE FROM categories WHERE id = '${id}'`;

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows < 1) {
      throw new NotFoundError('Gagal menghapus, kategori tidak ditemukan');
    }
  }
}

module.exports = ProductsService;
