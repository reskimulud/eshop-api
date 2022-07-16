const InvariantError = require('../../exceptions/InvariantError');
const { ProductsPayloadSchema } = require('./schema');

const ProductsValidator = {
  validateProductsPayload: (payload) => {
    const validationResult = ProductsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ProductsValidator;