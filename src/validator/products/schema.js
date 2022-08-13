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

const ProductQuerySchema = Joi.object({
  page: Joi.number().default(1).allow('', null),
  size: Joi.number().default(10).allow('', null),
  s: Joi.string().allow('', null),
});

module.exports = { 
  ProductsPayloadSchema,
  ProductImageHeaderSchema,
  ProductCategoriesPayloadSchema,
  ProductRatingsPayloadSchema,
  ProductQuerySchema,
};
