const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { imageUrlGenerator } = require('../../utils');

class CartsService {
  #database;

  constructor(database) {
    this.#database = database;
  }

  async #verifyCartOwner(userId, itemId) {
    const queryItem = `SELECT id FROM carts WHERE id = '${itemId}'`;

    const item = await this.#database.query(queryItem);

    if (!item || item.length < 1 || item.affectedRows < 1) {
      throw new NotFoundError('Item tidak ditemukan');
    }

    const query = `SELECT id FROM carts WHERE userId = '${userId}' AND id = '${itemId}'`;

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows < 1) {
      throw new AuthorizationError('Anda tidak dapat mengubah ini');
    }
  }

  async addCart(userId, productId, quantity) {
    const queryUser = `SELECT id FROM users WHERE id = '${userId}'`;

    const user = await this.#database.query(queryUser);

    if (!user || user.length < 1 || user.affectedRows < 1) {
      throw new NotFoundError('Gaal menambahkan item ke keranjang, user tidak ditemukan');
    }

    const id = `item-${nanoid(16)}`;
    const query = `INSERT INTO carts (id, productId, userId, quantity)
        VALUES (
          '${id}',
          '${productId}',
          '${userId}',
          ${quantity}
        )
    `;

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows < 1) {
      throw new InvariantError('Gagal menambahkan item ke keranjang');
    }
  }

  async getCartByUserId(userId) {
    const queryUser = `SELECT id FROM users WHERE id = '${userId}'`;

    const user = await this.#database.query(queryUser);

    if (!user || user.length < 1 || user.affectedRows < 1) {
      throw new NotFoundError('Gagal mengambil keranjang, user tidak ditemukan');
    }

    const query = `
      SELECT carts.id, 
        products.id AS productId, products.title, products.price, products.image,
        carts.quantity
      FROM products JOIN carts JOIN users
      ON carts.productId = products.id
      AND carts.userId = users.id
      WHERE carts.userId = '${userId}'
    `;

    const result = await this.#database.query(query);

    const products = result.map((product) => {
      if (product.image !== null) {
        product.image = imageUrlGenerator(product.image);
      }

      return product;
    })

    return products;
  }

  async updateCartByItemId(userId, itemId, qty) {
    await this.#verifyCartOwner(userId, itemId);

    const query = `UPDATE carts SET 
        quantity = ${qty}
      WHERE id = '${itemId}' AND userId = '${userId}'
    `;

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows < 1) {
      throw new InvariantError('Gagal memperbarui item di keranjang');
    }
  }

  async deleteCartByItemId(userId, itemId) {
    await this.#verifyCartOwner(userId, itemId);

    const query = `DELETE FROM carts WHERE id = '${itemId}' AND userId = '${userId}'`;

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows < 1) {
      throw new InvariantError('Gagal menghapus item di keranjang');
    }
  }
}

module.exports = CartsService;
