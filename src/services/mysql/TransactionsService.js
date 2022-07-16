const { nanoid } = require('nanoid');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class TransactionsService {
  #database;

  constructor(database) {
    this.#database = database;
  }

  async #verifyTransactionOwner(userId, transactionId) {
    const queryItem = `SELECT id FROM transactions WHERE id = '${transactionId}'`;

    const transaction = await this.#database.query(queryItem);

    if (!transaction || transaction.length < 1 || transaction.affectedRows < 1) {
      throw new NotFoundError('Transaksi tidak ditemukan');
    }

    const query = `SELECT id, dateCreated FROM transactions WHERE id = '${transactionId}' AND userId = '${userId}'`;

    const result = await this.#database.query(query);

    if (!transaction || transaction.length < 1 || transaction.affectedRows < 1) {
      throw new AuthorizationError('Transaksi tidak ditemukan, anda tidak mempunyai hak untuk mengakses ini');
    }

    return result[0];
  }

  async addCheckout(userId) {
    const queryUser = `SELECT id FROM users WHERE id = '${userId}'`;
    const user = await this.#database.query(queryUser);

    if (!user || user.length < 1 || user.affectedRows < 1) {
      throw new NotFoundError('Gagal checkout, user tidak ditemukan');
    }

    const queryCarts = `SELECT productId, quantity FROM carts WHERE userId = '${userId}'`;
    const carts = await this.#database.query(queryCarts);

    if (!carts || carts.length < 1 || carts.affectedRows < 1) {
      throw new NotFoundError('Gagal checkout, tidak terdapat item apapun di keranjang');
    }

    const transactionId = `transaction-${nanoid(16)}`;
    const queryTransaction = `INSERT INTO transactions (id, userId, dateCreated) VALUES (
      '${transactionId}',
      '${userId}',
      '${new Date().toLocaleString()}'
    )`;
    const transaction = await this.#database.query(queryTransaction);

    if (!transaction || transaction.length < 1 || transaction.affectedRows < 1) {
      throw new InvariantError('Gagal membuat transaksi');
    }

    carts.forEach(async (product) => {
      const id = `orderItem-${nanoid(16)}`;
      const query = `INSERT INTO orders (id, productId, userId, transactionId, quantity) VALUES (
        '${id}',
        '${product.productId}',
        '${userId}',
        '${transactionId}',
        '${product.quantity}'
      )`;

      const result = await this.#database.query(query);

      if (!result || result.length < 1 || result.affectedRows < 1) {
        throw new InvariantError('Transaksi gagal');
      }
    });

    await this.#database.query(`DELETE FROM carts WHERE userId = '${userId}'`);

    return transactionId;
  }

  async getTransactionsByUserId(userId) {
    const query = `SELECT id, dateCreated FROM transactions WHERE userId = '${userId}'`;

    const result = await this.#database.query(query);

    return result;
  }

  async getTransactionById(userId, transactionId) {
    const transaction = await this.#verifyTransactionOwner(userId, transactionId);

    const query = `
      SELECT products.title, products.price, products.image,
        orders.quantity
      FROM orders JOIN products
      ON orders.productId = products.id
      WHERE orders.transactionId = '${transaction.id}'
      AND orders.userId = '${userId}'
    `;

    const orders = await this.#database.query(query);

    if (!orders || orders.length < 1 || orders.affectedRows < 1) {
      throw new InvariantError('Transaksi gagal dimuat');
    }

    return {
      transaction,
      orders,
    };
  }
}

module.exports = TransactionsService;
