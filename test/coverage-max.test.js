'use strict'

const path = require('path')
const chai = require('chai')
const expect = chai.expect

const URN = require(path.resolve(__dirname, '../src/mvp/libs/urn'))

describe('coverage maximum', function () {
  it('should create a new database/entity urn', function (done) {
    const urn = URN.create('database', 'entity', 1234567890)
    expect(urn).to.be.a('string')
    done()
  })
  it('should throw error when decrypt an urn from validation', function (done) {
    const result = URN.validate('database', 'entity', '00000')
    expect(result).to.be.an('object')
    expect(result).to.have.property('valid')
    expect(result.valid).to.be.eq(false)
    done()
  })
})
