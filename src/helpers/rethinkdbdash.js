'use strict'

var config = require('nconf')
config.argv().env().file({ file: 'nconf-deve.json' })

module.exports = function (database) {
  var options = {
    host: config.get('CQRS_RETHINKDB_HOST'),
    port: config.get('CQRS_RETHINKDB_PORT'),
    db: config.get('CQRS_RETHINKDB_DB'),
    user: config.get('CQRS_RETHINKDB_USER'),
    password: config.get('CQRS_RETHINKDB_PASS'),
    discovery: false,
    silent: true
  }
  if (database === 'EMPTY') {
    delete options.db
  }
  var r = require('rethinkdbdash')(options)
  return r
}
