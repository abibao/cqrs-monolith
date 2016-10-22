'use strict'

const Promise = require('bluebird')

const URN = require('./../../libs/urn')
const Service = require('./../../libs/rethinkdb').service

module.exports = function (value) {
  return new Promise((resolve) => {
    let check = URN.validate('database', 'entity', value)
    if (check.valid) {
      const service = new Service('entities')
      service.get(check.value)
        .then((entry) => {
          resolve(entry.id)
        })
    } else {
      resolve('none')
    }
  })
}
