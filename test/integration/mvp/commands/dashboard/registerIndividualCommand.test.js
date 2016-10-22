'use strict'

const Promise = require('bluebird')
const path = require('path')
const chai = require('chai')
const expect = chai.expect

// declare configuration in a global mode
const config = require('nconf')
config.argv().env().file({ file: path.resolve(__dirname, '../../../../../src/mvp/config-deve.json') })

const rethinkdb = require(path.resolve(__dirname, '../../../../../src/mvp/rethinkdb'))

const Server = require('node-cqrs-framework').Server
const server = new Server({
  config,
  source: path.resolve(__dirname, '../../../../../src/mvp'),
  patterns: ['commands/dashboard/registerIndividualCommand.js']
})

describe('[integration] RegisterIndividualCommand', function () {
  it('should start server successfully', function (done) {
    Promise.all([rethinkdb.structure(), server.initialize()])
      .then((result) => {
        done()
      })
      .catch(done)
  })
  it('should register successfully', function (done) {
    server.execute('RegisterIndividualCommand', {})
      .then((result) => {
        expect(result).to.be.an('object')
        expect(result).to.have.property('uuid')
        expect(result).to.have.property('type')
        expect(result.type).to.be.eq('Command')
        expect(result).to.have.property('name')
        expect(result.name).to.be.eq('RegisterIndividualCommand')
        done()
      })
      .catch(done)
  })
})
