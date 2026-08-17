const Joi = require("joi");

const addressValidationSchema = Joi.object({
  type: Joi.string().required(),
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  pincode: Joi.number().required(),
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
});

module.exports = addressValidationSchema;