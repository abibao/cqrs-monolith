'use strict'

const Client = require('node-cqrs-framework').Client
const client = new Client()

const serviceName = 'VerifyRegisteredEntityQuery'

const handlerSuccess = function () {
  // 1) client subscribe to the events
  client.subscribe(serviceName + '.Success')
  client.subscribe(serviceName + '.Error')
  // 2) client.trigger will handler when a event is capture
  client.trigger.on(serviceName + '.Success', handlerExecuteSuccess)
  client.trigger.on(serviceName + '.Error', handlerExecuteError)
  // 3) go execute the service
  // GOOD client.send(serviceName, 'urn:abibao:database:entity:ffd98c849544f7ce5d9ce9209be8ef85f0c09fd3cf391b61')
  client.send(serviceName, 'urn:abibao:database:entity:ffd98c849544f7ce5d9ce9209be8ef85f0c09fd3cf391b61')
}

const handlerError = function (error) {
  console.log(error)
  process.exit(1)
}

const handlerExecuteSuccess = function (result) {
  console.log('handlerExecuteSuccess', result)
  process.exit(0)
}

const handlerExecuteError = function (error) {
  console.log('handlerExecuteError', error)
  process.exit(1)
}

client.initialize().then(handlerSuccess).catch(handlerError)
