const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class ProductsService {
  #database;

  constructor(database) {
    this.#database = database;
  }

  #imageUrlGenerator(filename) {
    const host = process.env.HOST;
    const port = process.env.PORT;
    if (port == 443) {
      return `https://${host}/products/image/${filename}`;
    } else {
      return `http://${host}:${port}/products/image/${filename}`;
    }
  }

  async addProduct(title, price, description) {
    const id = `product-${nanoid(16)}`
    const query = `INSERT INTO products (id, title, price, description, image)
      VALUES (
        '${id}',
        '${title}',
        ${price},
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
    const query = 'SELECT id, title, price, image FROM products';

    const result = await this.#database.query(query);

    const products = result.map((product) => {
      if (product.image != null) {
        product.image = this.#imageUrlGenerator(product.image);
      }

      return product;
    });

    return products;
  }

  async getProductById(id) {
    const query = `SELECT * FROM products WHERE id = '${id}'`;

    const result = await this.#database.query(query);

    if(!result || result.length < 1 || result.affectedRows < 1) {
      throw new NotFoundError('Produk tidak ditemukan');
    }

    const product = result[0];
    if (product.image != null) {
      product.image = this.#imageUrlGenerator(product.image);
    }

    return product;
  }

  async updateProductById(id, {title, price, description}) {
    const queryProduct = `SELECT id FROM products WHERE id = '${id}'`;

    const product = await this.#database.query(queryProduct);

    if (!product || product.length < 1 || product.affectedRows < 1) {
      throw new NotFoundError('Produk tidak ditemukan');
    }

    const query = `UPDATE products SET 
        title = '${title}',
        price = ${price},
        description = '${description}'
      WHERE id = '${id}'`;

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows < 1) {
      throw new InvariantError('Gagal memperbarui produk');
    }
  }

  async deleteProductById(id) {
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
}

module.exports = ProductsService;
