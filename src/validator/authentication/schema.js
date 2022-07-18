const Joi = require("joi");

const RegisterPayloadSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
});

const LoginPayloadSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { RegisterPayloadSchema, LoginPayloadSchema };
