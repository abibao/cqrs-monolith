'use strict'

const path = require('path')

const config = require('nconf')
config.argv().env().file({ file: path.resolve(__dirname, 'mvp/config-deve.json') })

const Client = require('node-cqrs-framework').Client
const client = new Client()

const handlerSuccess = function () {
  // 1) client subscribe to the events
  client.subscribe('SendEmailFromSendgridCommand.Success')
  client.subscribe('SendEmailFromSendgridCommand.Error')
  // 2) client.trigger will handler when a event is capture
  client.trigger.on('SendEmailFromSendgridCommand.Success', handlerOnSuccess)
  client.trigger.on('SendEmailFromSendgridCommand.Error', handlerOnError)
  // 3 client.send
  const payload = {
    'personalizations': [
      { 'to': [ { 'email': 'gperreymond@gmail.com' } ],
        'subject': 'Vérification de votre identité',
        'substitutions': {
          '%fingerprint%': 'https://www.google.fr'
        }
      }
    ],
    'from': { 'email': 'bonjour@abibao.com', 'name': 'Abibao' },
    'content': [ { 'type': 'text/html', 'value': ' ' } ],
    'template_id': config.get('CQRS_SENDGRID_TEMPLATE_ABIBAO_AUTOLOGIN')
  }
  client.send('SendEmailFromSendgridCommand', payload)
    .then((result) => {
      console.log('SendEmailFromSendgridCommand', result)
    })
}

const handlerError = function (error) {
  console.log(error)
  process.exit(1)
}

const handlerOnSuccess = function (result) {
  console.log('handlerOnSuccess', result)
  process.exit(0)
}

const handlerOnError = function (error) {
  console.log('handlerOnError', error)
  process.exit(1)
}

client.initialize().then(handlerSuccess).catch(handlerError)
