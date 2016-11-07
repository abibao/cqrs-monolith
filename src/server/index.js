'use strict'

const config = require('nconf')
config.argv().env().file({ file: 'config-deve.json' })

const path = require('path')

// declare server
const Server = require('node-cqrs-framework').Server
const server = new Server({
  bus: {
    host: config.get('CQRS_RABBITMQ_HOST'),
    port: config.get('CQRS_RABBITMQ_PORT'),
    user: config.get('CQRS_RABBITMQ_USER'),
    pass: config.get('CQRS_RABBITMQ_PASS')
  },
  source: path.resolve(__dirname),
  patterns: [
    'commands/**/*.js',
    'queries/**/*.js'
  ]
})

// start server
server.initialize()
  .then(() => {
    console.log('server has initialized')
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
