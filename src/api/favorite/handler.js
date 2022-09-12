class FavoritesHandler {
  #service;
  // #validator;

  constructor(service) {
    this.#service = service;
    // this.#validator = validator;

    this.getFavoriteProducts = this.getFavoriteProducts.bind(this);
    this.postFavoriteProduct = this.postFavoriteProduct.bind(this);
    this.deleteFavoriteProductById = this.deleteFavoriteProductById.bind(this);
  }

  async getFavoriteProducts(request, h) {
    const { id: userId } = request.auth.credentials;

    const favorites = await this.#service.getFavoriteProducts(userId);

    return {
      status: 'success',
      message: 'Data favorit produk berhasil diambil',
      data: favorites,
    };
  }

  async postFavoriteProduct(request, h) {}

  async deleteFavoriteProductById(request, h) {}
}

module.exports = FavoritesHandler;
