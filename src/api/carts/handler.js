class CartsHandler {
  #service;
  #validator;

  constructor(service, validator) {
    this.#service = service;
    this.#validator = validator;

    this.postCart = this.postCart.bind(this);
    this.getCartByUserId = this.getCartByUserId.bind(this)
  }

  async postCart(request, h) {
    this.#validator.validateCartsPayload(request.payload);
    const { userId } = request.params;
    const { productId, quantity } = request.payload;

    await this.#service.addCart(userId, productId, quantity);

    const response = h.response({
      status: 'success',
      message: 'Keranjang berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async getCartByUserId(request, h) {
    const { userId } = request.params;

    const cart = await this.#service.getCartByUserId(userId);
    let subTotal = 0;
    let totalItem = 0;

    cart.forEach((item) => {
      subTotal += item.price;
      totalItem += item.quantity;
    });

    return {
      status: 'success',
      message: 'Data keranjang berhasil diambil',
      data: {
        userId,
        totalItem,
        subTotal,
        cart,
      },
    };
  }
}

module.exports = CartsHandler;
