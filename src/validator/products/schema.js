const Joi = require('joi');

const ProductsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().allow('', null),
});

module.exports = { ProductsPayloadSchema };
