const Joi = require("joi");
const { password } = require("./custom.validation");

/**
 * Validation schema for user registration.
 */
const register = {
  body: Joi.object().keys({
   
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    password: Joi.string().required().custom(password).min(8),
    email: Joi.string().required().email().trim(),
    phone: Joi.string()
      .pattern(/^\+?(?:[0-9] ?){6,14}[0-9]$/)
      .trim(),
    profile_picture: Joi.any().optional(),
    address: Joi.string().required().max(200),
    city: Joi.number().required(),
    state: Joi.number().required(),
    country: Joi.number().required(),
    zipcode: Joi.string().required().max(7),
    pan_number: Joi.string().required().max(10).uppercase(),
    aadhar_number: Joi.number().required().min(12),
  }),
};

/**
 * Validation schema for user login.
 */
const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
};
