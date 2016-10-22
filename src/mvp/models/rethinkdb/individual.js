'use scrict'

const Joi = require('joi')

module.exports.before = Joi.object().keys({
  // fields
  email: Joi.string().email().required(),
  scope: Joi.string().default('administrator'),
  // calculated
  hashedPassword: Joi.string(),
  salt: Joi.string(),
  // automatic
  createdAt: Joi.date().required().default('now'),
  modifiedAt: Joi.date().required().default('now')
})
