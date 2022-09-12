class FavoritesHandler {
  #service;
  #validator;

  constructor(service, validator) {
    this.#service = service;
    this.#validator = validator;

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

  async postFavoriteProduct(request, h) {
    this.#validator.validateFavoriteProductsPayload(request.payload);
    const { id: userId } = request.auth.credentials;
    const { productId } = request.payload;

    const favoriteId = await this.#service.addFavoriteProduct(userId, productId);

    const response = h.response({
      status: 'success',
      message: 'Produk berhasil ditambahkan ke favorit',
      data: {
        favoriteId,
      }
    });
    response.code(201);
    return response;
  }

  async deleteFavoriteProductById(request, h) {}
}

module.exports = FavoritesHandler;
