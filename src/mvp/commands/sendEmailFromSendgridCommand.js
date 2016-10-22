'use strict'

const Promise = require('bluebird')

module.exports = function (payload) {
  return new Promise((resolve, reject) => {
    const sendgrid = require('sendgrid')(this.server.options.config.get('CQRS_SENDGRID_API_KEY'))
    const request = sendgrid.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: payload
    })
    sendgrid.API(request)
      .then(response => {
        if (response.statusCode === 202) {
          resolve()
        } else {
          reject(response)
        }
      })
      .catch(reject)
  })
}
