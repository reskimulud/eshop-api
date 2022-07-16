const Joi = require('joi');

const CartsPayloadSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
});

const CartsQuerySchema = Joi.object({
  qty: Joi.number().min(1).required(),
});

module.exports = { CartsPayloadSchema, CartsQuerySchema };
