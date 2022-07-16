const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CartsService {
  #database;

  constructor(database) {
    this.#database = database;
  }

  async addCart(userId, products) {
    const queryUser = `SELECT id FROM users WHERE id = '${userId}'`;

    const user = await this.#database.query(queryUser);

    if (!user || user.length < 1 || user.affectedRows < 1) {
      throw new NotFoundError('Gaal menambahkan item ke keranjang, user tidak ditemukan');
    }

    products.forEach(async (product) => {
      const id = `item-${nanoid(16)}`;
      const query = `INSERT INTO carts (id, productId, userId, quantity)
          VALUES (
            '${id}',
            '${product.productId}',
            '${userId}',
            ${product.qty}
          )
      `;

      const result = await this.#database.query(query);

      if (!result || result.length < 1 || result.affectedRows < 1) {
        throw new InvariantError('Gagal menambahkan item ke keranjang');
      }
    });
  }
}

module.exports = CartsService;
