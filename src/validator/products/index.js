const InvariantError = require('../../exceptions/InvariantError');
const { ProductsPayloadSchema, ProductImageHeaderSchema, ProductCategoriesPayloadSchema, ProductRatingsPayloadSchema, ProductQuerySchema } = require('./schema');

const ProductsValidator = {
  validateProductsPayload: (payload) => {
    const validationResult = ProductsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateProductImageHeader: (header) => {
    const validationResult = ProductImageHeaderSchema.validate(header);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateProductCategoriesPayload: (payload) => {
    const validationResult = ProductCategoriesPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateProductRatingsPayload: (payload) => {
    const validationResult = ProductRatingsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateProductQuery: (quey) => {
    const validationResult = ProductQuerySchema.validate(quey);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ProductsValidator;