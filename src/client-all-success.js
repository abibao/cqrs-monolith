'use strict'

const Client = require('node-cqrs-framework').Client
const client = new Client()

const handlerSuccess = function () {
  // 1) client subscribe to the events
  client.subscribe('SendEmailFromSendgridCommand.Success')
  // 2) client.trigger will handler when a event is capture
  client.trigger.on('SendEmailFromSendgridCommand.Success', handlerAllSuccess)
}

const handlerError = function (error) {
  console.log(error)
  process.exit(1)
}

const handlerAllSuccess = function (result) {
  console.log('handlerAllSuccess', result)
}

client.initialize().then(handlerSuccess).catch(handlerError)
