const { nanoid } = require('nanoid');

class ProductsHandler {
  #productsService;
  #storageService;
  #validator;

  constructor(productsService, storageService, validator) {
    this.#productsService = productsService;
    this.#storageService = storageService;
    this.#validator = validator;

    this.postProduct = this.postProduct.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.putProductById = this.putProductById.bind(this);
    this.deleteProductById = this.deleteProductById.bind(this);
    this.putProductImageById = this.putProductImageById.bind(this);
    this.postCategory = this.postCategory.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.getProductsByCategoryId = this.getProductsByCategoryId.bind(this);
    this.putCategoryById = this.putCategoryById.bind(this);
    this.deleteCategoryById = this.deleteCategoryById.bind(this);
  }

  async postProduct(request, h) {
    this.#validator.validateProductsPayload(request.payload);
    const { title, price, categoryId, description } = request.payload;
    const { id: userId } = request.auth.credentials;

    const productId = await this.#productsService.addProduct(userId, title, price, categoryId, description);

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
    const products = await this.#productsService.getAllProducts();

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

    const product = await this.#productsService.getProductById(id);

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
    const { title, price, categoryId, description } = request.payload;
    const { id: userId } = request.auth.credentials;

    await this.#productsService.updateProductById(id, userId, { title, price, categoryId, description });

    return {
      status: 'success',
      message: 'Produk berhasil diperbarui',
    };
  }

  async deleteProductById(request, h) {
    const { id } = request.params;
    const { id: userId } = request.auth.credentials;

    await this.#productsService.deleteProductById(id, userId);

    return {
      status: 'success',
      message: 'Produk berhasil dihapus',
    };
  }

  async putProductImageById(request, h) {
    const { image } = request.payload;
    const { id } = request.params;
    await this.#validator.validateProductImageHeader(image.hapi.headers);

    const nameId = `productImage-${nanoid(16)}`;
    const filename = await this.#storageService.writeFile(image, image.hapi, nameId);
    const oldFileName = await this.#productsService.updateProductImageById(id, filename);

    if (oldFileName != null) {
      await this.#storageService.deleteFile(oldFileName);
    }

    return {
      status: 'success',
      message: 'Gambar produk berhasil diperbarui',
    };
  }

  async postCategory(request, h) {
    this.#validator.validateProductCategoriesPayload
    const { id: userId } = request.auth.credentials;
    const { name } = request.payload;

    const categoryId = await this.#productsService.addCategory(name, userId);

    const response = h.response({
      status: 'success',
      message: 'Kategori berhasil ditambahkan',
      data: {
        categoryId,
      },
    });
    response.code(201);
    return response;
  }

  async getCategories(request, h) {
    const categories = await this.#productsService.getCategories();

    return {
      status: 'success',
      message: 'Data kategori berhasil diambil',
      data: {
        categories,
      }
    };
  }

  async getProductsByCategoryId(request, h) {
    const { id } = request.params;

    const { categoryName, products } = await this.#productsService.getProductsByCategoryId(id);

    return {
      status: 'success',
      message: 'Data produk berhasil diambil',
      data: {
        categoryName,
        countItem: products.length,
        products,
      },
    };
  }

  async putCategoryById(request, h) {
    this.#validator.validateProductCategoriesPayload(request.payload);
    const { id } = request.params;
    const { name } = request.payload;
    const { id: userId } = request.auth.credentials;

    await this.#productsService.updateCategoryById(id, name, userId);

    return {
      status: 'success',
      message: 'Data kategori berhasil diperbarui'
    };
  }

  async deleteCategoryById(request, h) {
    const { id } = request.params;
    const { id: userId } = request.auth.credentials;

    await this.#productsService.deleteCategoryById(id, userId);

    return {
      status: 'success',
      message: 'Data kategori berhasil dihapus',
    };
  }
}

module.exports = ProductsHandler;
