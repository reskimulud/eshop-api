const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CartsService {
  #database;

  constructor(database) {
    this.#database = database;
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

    return result;
  }
}

module.exports = CartsService;
