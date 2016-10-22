'use strict'

const path = require('path')
const chai = require('chai')
const expect = chai.expect

const config = require('nconf')
config.argv().env().file({ file: path.resolve(__dirname, '../../../../../src/mvp/config-deve.json') })

const URN = require(path.resolve(__dirname, '../../../../../src/mvp/libs/urn'))

const Server = require('node-cqrs-framework').Server
const server = new Server({
  config,
  source: path.resolve(__dirname, '../../../../../src/mvp'),
  patterns: ['queries/dashboard/verifyRegisteredEntityQuery.js']
})

describe('[unit] VerifyRegisteredEntityQuery', function () {
  it('should start server successfully', function (done) {
    server.initialize()
      .then((result) => {
        done()
      })
      .catch(done)
  })
  it('should verify a bad entity urn', function (done) {
    const urn = URN.create('database', 'charity', '1234567890')
    server.execute('VerifyRegisteredEntityQuery', urn)
      .then((result) => {
        expect(result).to.be.an('object')
        expect(result).to.have.property('uuid')
        expect(result).to.have.property('type')
        expect(result).to.have.property('name')
        expect(result).to.have.property('exectime')
        expect(result).to.have.property('result')
        expect(result.result).to.be.eq('none')
        done()
      })
      .catch((error) => {
        console.log(error)
        done(error)
      })
  })
})
