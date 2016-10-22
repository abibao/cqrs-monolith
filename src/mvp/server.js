'use strict'

const Promise = require('bluebird')
const path = require('path')

// declare configuration in a global mode
const config = require('nconf')
config.argv().env().file({ file: path.resolve(__dirname, 'config-deve.json') })

const rethinkdb = require('./rethinkdb')

// declare server
const Server = require('node-cqrs-framework').Server
const server = new Server({
  config,
  source: path.resolve(__dirname),
  patterns: [
    'commands/**/*.js',
    'queries/**/*.js'
  ]
})

// start server
Promise.all([rethinkdb.structure(), server.initialize()])
  .then(() => {
    console.log('server has initialized')
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
