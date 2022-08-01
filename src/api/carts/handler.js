class CartsHandler {
  #service;
  #validator;

  constructor(service, validator) {
    this.#service = service;
    this.#validator = validator;

    this.postCart = this.postCart.bind(this);
    this.getCartByUserId = this.getCartByUserId.bind(this);
    this.putCartByItemId = this.putCartByItemId.bind(this);
    this.deleteCartByItemId = this.deleteCartByItemId.bind(this);
  }

  async postCart(request, h) {
    this.#validator.validateCartsPayload(request.payload);
    const { id: userId } = request.auth.credentials;
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
    console.log(request.auth);
    const { id: userId } = request.auth.credentials;

    const cart = await this.#service.getCartByUserId(userId);
    let subTotal = 0;
    let totalItem = 0;

    cart.forEach((item) => {
      subTotal += (item.price * item.quantity);
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

  async putCartByItemId(request, h) {
    const { id: userId } = request.auth.credentials;
    const { itemId } = request.params;

    this.#validator.validateCartsQuery(request.query);
    const { qty } = request.query;

    await this.#service.updateCartByItemId(userId, itemId, qty);

    return {
      status: 'success',
      message: 'Item dalam keranjang berhasil diperbarui',
    };
  }

  async deleteCartByItemId(request, h) {
    const { id: userId } = request.auth.credentials;
    const { itemId } = request.params;

    await this.#service.deleteCartByItemId(userId, itemId);

    return {
      status: 'success',
      message: 'Item dalam keranjang berhasil dihapus',
    };
  }
}

module.exports = CartsHandler;
