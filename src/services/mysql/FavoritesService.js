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
    const id = `favorite-${nanoid(16)}`;

    const query = `
        INSERT INTO favorites (id, userId, favoriteId)
        VALUES (
          userId = '${userId}',
          productId = '${productId}'
        )
      `;

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows  < 1) {
      throw new InvariantError('Gagal menambahkan produk ke favorite');
    }

    return id;
  }
}

module.exports = FavoritesService;
