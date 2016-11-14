'use strict'

const Service = require('feathers-rethinkdb')

const CONST_RETHINKDB_CONNECTION = 'CONST_RETHINKDB_CONNECTION'
const MYSQL_CONNECTION_CONNECTION = 'MYSQL_CONNECTION_CONNECTION'

const initialize = function (connection, database, table) {
  switch (connection) {
    case CONST_RETHINKDB_CONNECTION:
      return new Service({
        Model: require('./rethinkdbdash')(database),
        name: table,
        paginate: {
          default: 10,
          max: 50
        }
      })
    default:
      return false
  }
}

module.exports.initialize = initialize

module.exports.RETHINKDB_CONNECTION = CONST_RETHINKDB_CONNECTION
module.exports.MYSQL_CONNECTION = MYSQL_CONNECTION_CONNECTION
