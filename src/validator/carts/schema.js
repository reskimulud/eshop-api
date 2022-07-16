const Joi = require('joi');

const CartsPayloadSchema = Joi.object({
  products: Joi.array().items(Joi.object(
    {
      productId: Joi.string().required(),
      qty: Joi.number().min(1).required(),
    },
  )).required(),
});

module.exports = { CartsPayloadSchema };
