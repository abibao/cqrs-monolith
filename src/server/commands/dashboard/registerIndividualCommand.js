'use strict'

var config = require('nconf')
config.argv().env().file({ file: 'nconf-deve.json' })

const Promise = require('bluebird')
const Joi = require('joi')

var bson = require('bson')
var ObjectId = bson.ObjectId

const ServiceHelper = require('./../../../helpers/feathers-service')
// const Client = require('node-cqrs-framework').Client
const validate = Promise.promisify(Joi.validate)

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  hasRegisteredEntity: Joi.string().default('none'),
  scope: Joi.string().valid(['individual']).default('individual')
})

module.exports = function (payload) {
  return new Promise((resolve, reject) => {
    /* const client = new Client({
      host: config.get('CQRS_RABBITMQ_HOST'),
      port: config.get('CQRS_RABBITMQ_PORT'),
      user: config.get('CQRS_RABBITMQ_USER'),
      pass: config.get('CQRS_RABBITMQ_PASS')
    }) */
    validate(payload, schema)
      /* .then(() => {
        return client.initialize()
      }) */
      .then(() => {
        // validate hasRegisteredEntity is exists
        if (payload.hasRegisteredEntity) {
          return 'none'
          // return client.request('VerifyRegisteredEntityQuery', payload.hasRegisteredEntity)
        } else {
          return 'none'
        }
      })
      .then((hasRegisteredEntity) => {
        if (typeof hasRegisteredEntity === 'string') {
          payload.hasRegisteredEntity = hasRegisteredEntity
        }
        if (typeof hasRegisteredEntity === 'object') {
          payload.hasRegisteredEntity = hasRegisteredEntity.result
        }
        // register a new individual
        payload.id = new ObjectId().toString()
        payload.scope = 'individual'
        payload.createdAt = new Date()
        payload.modifiedAt = new Date()
        const service = ServiceHelper.initialize(ServiceHelper.RETHINKDB_CONNECTION, config.get('CQRS_RETHINKDB_DATABASE_MVP'), 'individuals')
        service.create(payload).then(resolve).catch(reject)
      })
      .catch(reject)
  })
}
