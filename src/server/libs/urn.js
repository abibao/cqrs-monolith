'use strict'

const path = require('path')
const _ = require('lodash')

const config = require('nconf')
config.argv().env().file({ file: path.resolve(__dirname, '../config-deve.json') })

const Cryptr = require('cryptr')
const cryptr = new Cryptr(config.get('CQRS_AUTH_JWT_KEY'))

module.exports.create = function (type, name, value) {
  return 'urn:abibao:' + type + ':' + name + ':' + cryptr.encrypt(value)
}

module.exports.validate = function (type, name, urn) {
  try {
    const params = _.split(urn, ':')
    return {
      valid: (type === params[2]) && (name === params[3]),
      value: cryptr.decrypt(params[4])
    }
  } catch (e) {
    return {
      valid: false
    }
  }
}
