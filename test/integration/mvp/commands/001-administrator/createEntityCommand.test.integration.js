'use strict'

const path = require('path')
const chai = require('chai')
const expect = chai.expect

const rethinkdb = require(path.resolve(__dirname, '../../../../../src/mvp/libs/rethinkdb'))

const Server = require('node-cqrs-framework').Server
const server = new Server({
  config: rethinkdb.config,
  source: path.resolve(__dirname, '../../../../../src/mvp'),
  patterns: [
    'commands/administrator/createEntityCommand.js'
  ]
})

describe('[integration] CreateEntityCommand', function () {
  it('should start server successfully', function (done) {
    server.initialize()
      .then((result) => {
        done()
      })
      .catch(done)
  })
  it('should create a charity "none" successfully', function (done) {
    const payload = {
      name: 'none',
      contact: 'none@none.com',
      url: 'http://www.none.com',
      type: 'charity',
      title: 'none title',
      hangs: 'none hangs',
      description: 'none description',
      usages: 'none|usages'
    }
    server.execute('CreateEntityCommand', payload)
      .then((result) => {
        expect(result).to.be.an('object')
        done()
      })
      .catch((error) => {
        console.log(error)
        done(error)
      })
  })
  it('should create a charity "clown-hopital" successfully', function (done) {
    const payload = {
      name: '« Clowns Z’hôpitaux »',
      contact: 'contact@clown-hopital.com',
      url: 'http://www.clown-hopital.com',
      picture: 'images/pictures/clowns_picture.png',
      icon: 'images/icons/clowns_icon.png',
      type: 'charity',
      title: '« Clowns Z’hôpitaux »',
      hangs: 'Faîtes entrer les Clowns à l’hôpital',
      description: 'Depuis 2004, l’association « Clowns Z’hôpitaux » a pour objectif de créer et d’organiser des interventions de duos de Clowns en milieu hospitalier et dans tous les établissements de soins à destination de celles et ceux qui ont besoin de réconfort à l’hôpital comme en maison de retraite ou en maison d’accueil spécialisé : enfants, personnes âgées, adultes en situation de handicap.',
      usages: 'Pérenniser l’intervention des Clowns auprès des enfants de la Fondation Paul Parquet de Neuilly-sur-Seine|Augmenter la fréquence des interventions dans le service Pédiatrie de l’hôpital d’Orsay|Développer les interventions auprès des adultes porteurs de handicap au sein de l’ARHAM de Strabourg|Accroître l’action des Clowns auprès des personnes âgées de l’EHPAD Drôme-Nord de Romans-sur-Isère'
    }
    server.execute('CreateEntityCommand', payload)
      .then((result) => {
        expect(result).to.be.an('object')
        done()
      })
      .catch((error) => {
        console.log(error)
        done(error)
      })
  })
})
