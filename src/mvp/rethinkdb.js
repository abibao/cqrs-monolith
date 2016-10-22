'use strict'

const path = require('path')

// declare configuration in a global mode
const config = require('nconf')
config.argv().env().file({ file: path.resolve(__dirname, 'config-deve.json') })

const Promise = require('bluebird')

const rethink = require('rethinkdbdash')
const Service = require('feathers-rethinkdb')

const r = rethink({
  host: config.get('CQRS_RETHINKDB_HOST'),
  port: config.get('CQRS_RETHINKDB_PORT'),
  db: config.get('CQRS_RETHINKDB_DB'),
  user: config.get('CQRS_RETHINKDB_USER'),
  password: config.get('CQRS_RETHINKDB_PASSWORD'),
  authKey: config.get('CQRS_RETHINKDB_AUTH_KEY'),
  discovery: false,
  silent: true
})

const service = function (table) {
  return new Service({
    Model: r,
    name: table,
    paginate: {
      default: 10,
      max: 50
    }
  })
}

module.exports.structure = function () {
  return new Promise((resolve, reject) => {
    r.dbList().contains(config.get('CQRS_RETHINKDB_DB'))
      .do(dbExists => r.branch(dbExists, {created: 0}, r.dbCreate(config.get('CQRS_RETHINKDB_DB')))).run()
      .then(() => {
        return r.db(config.get('CQRS_RETHINKDB_DB')).tableList().contains('individuals').do(tableExists => r.branch(tableExists, {created: 0}, r.tableCreate('individuals')))
      })
      .then(() => {
        return r.db(config.get('CQRS_RETHINKDB_DB')).tableList().contains('surveys').do(tableExists => r.branch(tableExists, {created: 0}, r.tableCreate('surveys')))
      })
      .then(resolve)
      .catch(reject)
  })
}
module.exports.r = r
module.exports.service = service
