'use strict'

const config = require('nconf')
config.argv().env().file({ file: 'config-deve.json' })

const Client = require('node-cqrs-framework').Client
const client = new Client({
  bus: {
    host: config.get('CQRS_RABBITMQ_HOST'),
    port: config.get('CQRS_RABBITMQ_PORT'),
    user: config.get('CQRS_RABBITMQ_USER'),
    pass: config.get('CQRS_RABBITMQ_PASS')
  }
})

const handlerSuccess = function () {
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

client
  .subscribe('SendEmailFromSendgridCommand.Success', handlerOnSuccess)
  .subscribe('SendEmailFromSendgridCommand.Error', handlerOnError)
  .initialize()
  .then(handlerSuccess)
  .catch(handlerError)
