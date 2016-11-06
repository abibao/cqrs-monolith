'use strict'

const config = require('nconf')
config.argv().env().file({ file: 'config-deve.json' })

const Client = require('node-cqrs-framework').Client
const client = new Client({
  host: config.get('CQRS_RABBITMQ_HOST'),
  port: config.get('CQRS_RABBITMQ_PORT'),
  user: config.get('CQRS_RABBITMQ_USER'),
  pass: config.get('CQRS_RABBITMQ_PASS')
})

client
  .subscribe('VerifyRegisteredEntityQuery.Success', (result) => {
    console.log('VerifyRegisteredEntityQuery.Success', result)
  })
  .subscribe('VerifyRegisteredEntityQuery.Error', (error) => {
    console.log('VerifyRegisteredEntityQuery.Error', error)
  })
  .initialize()
  .then(() => {
    client.publish('VerifyRegisteredEntityQuery', 'urn:abibao:database:entity:ffd68c859013a69d0893be25caede9d4a2c69b86986b1d34')
    client.publish('VerifyRegisteredEntityQuery', 'urn:abibao:database:entity:ffd98c849544f7ce5d9ce9209be8ef85f0c09fd3cf391b61')
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
