'use strict'

const Promise = require('bluebird')

const CreateEntryHandler = require('./../../handlers/rethinkdb/CreateEntryHandler')

module.exports = function (payload) {
  return new Promise((resolve, reject) => {
    const handler = new CreateEntryHandler({
      plurial: 'individuals',
      singular: 'individual',
      getIDfromURN: ['urn'],
      getURNfromID: [
        { key: 'id', value: 'individual' },
        { key: 'charity', value: 'entity' },
        { key: 'hasRegisteredEntity', value: 'entity' }
      ],
      params: payload
    })
    return handler.execute()
  })
}
