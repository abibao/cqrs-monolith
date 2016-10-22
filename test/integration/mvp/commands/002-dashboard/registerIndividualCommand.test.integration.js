'use strict'

const path = require('path')
const chai = require('chai')
const expect = chai.expect

const rethinkdb = require(path.resolve(__dirname, '../../../../../src/mvp/libs/rethinkdb'))
const URN = require(path.resolve(__dirname, '../../../../../src/mvp/libs/urn'))

const Server = require('node-cqrs-framework').Server
const server = new Server({
  config: rethinkdb.config,
  source: path.resolve(__dirname, '../../../../../src/mvp'),
  patterns: [
    'commands/dashboard/registerIndividualCommand.js',
    'queries/dashboard/verifyRegisteredEntityQuery.js',
    'queries/administrator/getEntityByNameQuery.js'
  ]
})

describe('[integration] RegisterIndividualCommand', function () {
  it('should start server successfully', function (done) {
    server.initialize()
      .then((result) => {
        done()
      })
      .catch(done)
  })
  it('should register successfully without hasRegisteredEntity', function (done) {
    const payload = {
      email: 'test@integration.com'
    }
    server.execute('RegisterIndividualCommand', payload)
      .then((result) => {
        expect(result).to.be.an('object')
        done()
      })
      .catch(done)
  })
  it('should register successfully with error decrypt hasRegisteredEntity', function (done) {
    const payload = {
      email: 'decrypt_error@hasRegisteredEntity.com',
      hasRegisteredEntity: 'urn:abibao:database:entity:01234567890'
    }
    server.execute('RegisterIndividualCommand', payload)
      .then((result) => {
        expect(result).to.be.an('object')
        done()
      })
      .catch(done)
  })
  it('should register successfully with a bad hasRegisteredEntity', function (done) {
    const payload = {
      email: 'bad_urn@hasRegisteredEntity.com',
      hasRegisteredEntity: 'entity'
    }
    server.execute('RegisterIndividualCommand', payload)
      .then((result) => {
        expect(result).to.be.an('object')
        done()
      })
      .catch(done)
  })
  it('should register successfully with a good hasRegisteredEntity', function (done) {
    server.execute('GetEntityByNameQuery', '« Clowns Z’hôpitaux »')
      .then((result) => {
        expect(result).to.be.an('object')
        expect(result).to.have.property('result')
        expect(result.result).to.be.an('array')
        const entity = result.result[0]
        expect(entity).to.be.an('object')
        expect(entity).to.have.property('id')
        const payload = {
          email: 'good_urn@hasRegisteredEntity.com',
          hasRegisteredEntity: URN.create('database', 'entity', entity.id)
        }
        server.execute('RegisterIndividualCommand', payload)
          .then((result) => {
            expect(result).to.be.an('object')
            done()
          })
          .catch(done)
      })
      .catch(done)
  })
})
