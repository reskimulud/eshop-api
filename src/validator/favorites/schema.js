const Joi = require('joi');

const FavoriteProductsPayloadSchema = Joi.object({
  productId: Joi.string().required(),
});

module.exports = { FavoriteProductsPayloadSchema };
