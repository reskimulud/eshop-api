class CartsHandler {
  #service;
  #validator;

  constructor(service, validator) {
    this.#service = service;
    this.#validator = validator;

    this.postCart = this.postCart.bind(this);
  }

  async postCart(request, h) {
    this.#validator.validateCartsPayload(request.payload);
    const { userId } = request.params;
    const { products } = request.payload;

    await this.#service.addCart(userId, products);

    const response = h.response({
      status: 'success',
      message: 'Keranjang berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }
}

module.exports = CartsHandler;
