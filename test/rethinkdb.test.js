'use strict'

const Promise = require('bluebird')

const path = require('path')

const structure = require(path.resolve(__dirname, '../src/server/libs/rethinkdb')).structure
const r = require(path.resolve(__dirname, '../src/server/libs/rethinkdb')).r

describe('rethinkdb prepare', function () {
  it('should create tables', function (done) {
    structure()
      .then(() => {
        done()
      })
      .catch(done)
  })
  it('should empty tables', function (done) {
    Promise.all([
      r.db('test').table('individuals').delete(),
      r.db('test').table('entities').delete()
    ])
    .then(() => {
      done()
    })
    .catch(done)
  })
})
