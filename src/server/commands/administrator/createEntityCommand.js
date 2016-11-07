'use strict'

const Promise = require('bluebird')
const Joi = require('joi')

var bson = require('bson')
var ObjectId = bson.ObjectId

const Service = require('./../../../libs/rethinkdb').service

const schema = Joi.object().keys({
  name: Joi.string().required(),
  contact: Joi.string().email().required(),
  url: Joi.string().uri().default('http://').required(),
  type: Joi.string().valid(['none', 'abibao', 'charity', 'company']).required(),
  icon: Joi.string().default('images/icons/default.png'),
  avatar: Joi.string().default('images/avatars/default.png'),
  picture: Joi.string().default('images/pictures/default.png'),
  title: Joi.string().required(),
  hangs: Joi.string().required(),
  description: Joi.string().required(),
  usages: Joi.string().required()
})

module.exports = function (payload) {
  return new Promise((resolve, reject) => {
    Joi.validate(payload, schema, function (error) {
      if (error) {
        reject(error)
      } else {
        payload.id = new ObjectId().toString()
        payload.createdAt = new Date()
        payload.modifiedAt = new Date()
        payload.icon = payload.icon || 'images/icons/default.png'
        payload.avatar = payload.avatar || 'images/icons/default.png'
        payload.picture = payload.picture || 'images/icons/default.png'
        const service = new Service('entities')
        service.create(payload).then(resolve).catch(reject)
      }
    })
  })
}
