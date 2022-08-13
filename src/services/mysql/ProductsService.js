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

  async #getRattingsByProductId(productId) {
    const query = `SELECT rate FROM ratings WHERE productId = '${productId}'`;
    const result = await this.#database.query(query);

    if (!result || result.length < 1) {
      return { rate: 0, count: 0 }
    }

    const count = result.length;
    let sumRate = 0;

    result.forEach((rating) => {
      sumRate += rating.rate;
    });

    const rate = sumRate/count;

    return {rate, count};
  }

  async addProduct(userId, title, price, categoryId, description) {
    await this.#verifyUserRole(userId);
    const id = `product-${nanoid(16)}`;
    const createdAt = new Date().getTime();
    const updatedAt = createdAt;
    const query = `INSERT INTO products (id, title, price, categoryId, createdAt, updatedAt, description, image)
      VALUES (
        '${id}',
        "${title}",
        ${price},
        '${categoryId}',
        ${createdAt},
        ${updatedAt},
        "${description}",
        NULL
      )`;

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows  < 1) {
      throw new InvariantError('Gagal menambahkan produk')
    }

    return id;
  }

  async getAllProducts(page = 1, size = 10, search = null) {
    const offset = (page <= 1) ? 0 : (page - 1) * size;
    let query = `SELECT products.id, products.title,
                      products.price, products.description,
                      products.image, categories.name as category
                    FROM products JOIN categories
                    ON products.categoryId = categories.id`;

    if (search !== null) {
      query += ` WHERE products.title LIKE '%${search}%'
          OR products.description LIKE '%${search}%'`
    }

    query += ` ORDER BY products.updatedAt DESC LIMIT ${offset}, ${size}`

    const result = await this.#database.query(query);

    const products = await Promise.all(result.map(async (product) => {
      if (product.image !== null) {
        product.image = imageUrlGenerator(product.image);
      }

      product.rating = await this.#getRattingsByProductId(product.id);

      return product;
    }));

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

    const rating = await this.#getRattingsByProductId(product.id);
    product.rating = rating;

    const queryReview = `SELECT users.name AS user, ratings.rate, ratings.review
                          FROM users JOIN ratings
                          ON ratings.userId = users.id
                          WHERE ratings.productId = '${product.id}'
    `;
    const reviews = await this.#database.query(queryReview);
    product.reviews = reviews;

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
        title = "${title}",
        price = ${price},
        categoryId = '${categoryId}',
        updatedAt = ${updatedAt},
        description = "${description}"
      WHERE id = '${id}'`;

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows < 1) {
      throw new InvariantError('Gagal memperbarui produk');
    }
  }

  async deleteProductById(id, userId) {
    await this.#verifyUserRole(userId);
    try {
      const query = `DELETE FROM products WHERE id = '${id}'`;

      const result = await this.#database.query(query);

      if (!result || result.length < 1 || result.affectedRows < 1) {
        throw new NotFoundError('Gagal menghapus produk, id tidak ditemukan');
      }
    } catch (err) {
      throw new InvariantError('Tidak dapat menghapus produk');
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
        "${name}"
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

  async getProductsByCategoryId(categoryId, page = 1, size = 10, search = null) {
    const offset = (page <= 1) ? 0 : (page - 1) * size;
    const queryCategory = `SELECT name FROM categories WHERE id = '${categoryId}'`
    const category = await this.#database.query(queryCategory);
    if (!category || category.length < 1) {
      throw new NotFoundError('Gagal mengambil data, kategori tidak ditemukan');
    }

    let query = `SELECT products.id, products.title,
                      products.price, products.description,
                      products.image, categories.name as category
                    FROM products JOIN categories
                    ON products.categoryId = categories.id
                    WHERE products.categoryId = '${categoryId}'`;

    if (search !== null) {
      query += ` AND products.title LIKE '%${search}%'
          OR products.description LIKE '%${search}%'`
    }

    query += ` ORDER BY products.updatedAt DESC LIMIT ${offset}, ${size}`

    const products = await this.#database.query(query);
    const categoryName = category[0].name;

    return { categoryName, products };
  }

  async updateCategoryById(id, name, userId) {
    await this.#verifyUserRole(userId);
    const query = `UPDATE categories
        SET name = "${name}"
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

  async addProductRating(userId, productId, rate, review) {
    const queryProduct = `SELECT id FROM products WHERE id = '${productId}'`;
    const product = await this.#database.query(queryProduct);
    if (!product || product.length < 1) {
      throw new NotFoundError('Gagal menambahkan ulasan, produk tidak ditemukan');
    }

    const queryExitingRating = `SELECT id FROM ratings WHERE userId = '${userId}' AND productId = '${productId}'`;
    const exitingRating = await this.#database.query(queryExitingRating);
    if (exitingRating.length > 0) {
      throw new InvariantError('Rating hanya bisa dibuat sekali');
    }

    const id = `rating-${nanoid(16)}`;
    const query = `INSERT INTO ratings (id, userId, productId, rate, review)
                    VALUES (
                      '${id}',
                      '${userId}',
                      '${productId}',
                      ${rate},
                      "${review}"
                    )`;
    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows < 1) {
      throw new InvariantError('Gagal menambahkan ulasan');
    }
  }
}

module.exports = ProductsService;
