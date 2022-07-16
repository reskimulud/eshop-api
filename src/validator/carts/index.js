const InvariantError = require('../../exceptions/InvariantError');
const { CartsPayloadSchema, CartsQuerySchema } = require('./schema');

const CartsValidator = {
  validateCartsPayload: (payload) => {
    const validationResult = CartsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateCartsQuery: (query) => {
    const validationResult = CartsQuerySchema.validate(query);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CartsValidator;
