const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class FavoritesService {
  #database;

  constructor(database) {
    this.#database = database;
  }

  async getFavoriteProducts(userId) {
    const query = `
        SELECT products.id, products.title,
          products.price, products.image
        FROM products JOIN favorites
        ON products.id = favorites.productId
        WHERE favorites.userId = '${userId}'
      `;

    return await this.#database.query(query);
  }

  async addFavoriteProduct(userId, productId) {

    const queryIsExiting = `
        SELECT id FROM favorites
          WHERE productId = '${productId}'
          AND userId = '${userId}'
      `;

    const resultExiting = await this.#database.query(queryIsExiting);

    if (resultExiting.length > 0) {
      throw new InvariantError('Produk hanya bisa ditambahkan sekali ke favorit');
    }

    const id = `favorite-${nanoid(16)}`;

    const query = `
        INSERT INTO favorites (id, productId, userId)
        VALUES (
          '${id}',
          '${productId}',
          '${userId}'
        )
      `;

    try {
      const result = await this.#database.query(query);

      if (!result || result.length < 1 || result.affectedRows  < 1) {
        throw new InvariantError('Gagal menambahkan produk ke favorite');
      }

      return id;
    } catch (err) {
      throw new InvariantError('Produk tidak ditemukan')
    }
  }
}

module.exports = FavoritesService;
