const InvariantError = require('../../exceptions/InvariantError');
const { FavoriteProductsPayloadSchema } = require('./schema');

const FavoritesValidator = {
  validateFavoriteProductsPayload: (payload) => {
    const validationResult = FavoriteProductsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = FavoritesValidator;
