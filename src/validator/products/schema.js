const Joi = require('joi');

const ProductsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required(),
  categoryId: Joi.string().required(),
  description: Joi.string().allow('', null).required(),
});

const ProductImageHeaderSchema = Joi.object({
  'content-type': Joi.string().valid(
      'image/apng',
      'image/avif',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/webp').required(),
}).unknown();

const ProductCategoriesPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const ProductRatingsPayloadSchema = Joi.object({
  rate: Joi.number().min(1).max(5).required(),
  review: Joi.string().allow('', null).required(),
});

module.exports = { 
  ProductsPayloadSchema,
  ProductImageHeaderSchema,
  ProductCategoriesPayloadSchema,
  ProductRatingsPayloadSchema,
};
