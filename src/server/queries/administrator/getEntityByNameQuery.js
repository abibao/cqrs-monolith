'use strict'

const Promise = require('bluebird')

const Service = require('./../../../libs/rethinkdb').service

module.exports = function (name) {
  return new Promise((resolve, reject) => {
    const service = new Service('entities')
    service.find({
      paginate: false,
      query: {
        name
      }
    })
    .then(resolve).catch(reject)
  })
}
