const { nanoid } = require('nanoid');

class ProductsHandler {
  #service;
  #validator;

  constructor(service, validator) {
    this.#service = service;
    this.#validator = validator;

    this.postProduct = this.postProduct.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.putProductById = this.putProductById.bind(this);
    this.deleteProductById = this.deleteProductById.bind(this);
  }

  async postProduct(request, h) {
    this.#validator.validateProductsPayload(request.payload);
    const { title, price, description } = request.payload;
    const { id: userId } = request.auth.credentials;

    const productId = await this.#service.addProduct(userId, title, price, description);

    const response = h.response({
      status: 'success',
      message: 'Produk berhasil ditambahkan',
      data: {
        productId,
      },
    });
    response.code(201);
    return response;
  }

  async getProducts(request, h) {
    const products = await this.#service.getAllProducts();

    return {
      status: 'success',
      message: 'Data produk berhasil diambil',
      data: {
        products,
      }
    };
  }

  async getProductById(request, h) {
    const { id } = request.params;

    const product = await this.#service.getProductById(id);

    return {
      status: 'success',
      message: 'Data produk berhasil diambil',
      data: {
        product,
      },
    };
  }

  async putProductById(request, h) {
    this.#validator.validateProductsPayload(request.payload);
    const { id } = request.params;
    const { title, price, description } = request.payload;
    const { id: userId } = request.auth.credentials;

    await this.#service.updateProductById(id, userId, { title, price, description });

    return {
      status: 'success',
      message: 'Produk berhasil diperbarui',
    };
  }

  async deleteProductById(request, h) {
    const { id } = request.params;
    const { id: userId } = request.auth.credentials;

    await this.#service.deleteProductById(id, userId);

    return {
      status: 'success',
      message: 'Produk berhasil dihapus',
    };
  }

}

module.exports = ProductsHandler;
