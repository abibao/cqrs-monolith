'use strict'

const path = require('path')
const chai = require('chai')
const expect = chai.expect

const config = require('nconf')
config.argv().env().file({ file: path.resolve(__dirname, '../../../../../src/server/config-deve.json') })

const Server = require('node-cqrs-framework').Server
const server = new Server({
  config,
  source: path.resolve(__dirname, '../../../../../src/server'),
  patterns: [
    'commands/dashboard/registerIndividualCommand.js',
    'queries/dashboard/verifyRegisteredEntityQuery.js'
  ]
})

describe('[unit] RegisterIndividualCommand', function () {
  it('should start server successfully', function (done) {
    server.initialize()
      .then((result) => {
        done()
      })
      .catch(done)
  })
  it('should not register an individual', function (done) {
    server.execute('RegisterIndividualCommand', {})
      .then((result) => {
        done(new Error('no error found'))
      })
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error).to.have.property('eraro')
        expect(error).to.have.property('cqrs-framework')
        expect(error).to.have.property('details')
        expect(error).to.have.property('code')
        expect(error.eraro).to.be.equal(true)
        expect(error.code).to.be.equal('service_error')
        expect(error['cqrs-framework']).to.be.equal(true)
        expect(error.details).to.be.an('object')
        done()
      })
  })
})
