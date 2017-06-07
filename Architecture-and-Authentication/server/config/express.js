const handlebars = require('express-handlebars')
const express = require('express')

module.exports = (app) => {
  app.engine('handlebars', handlebars({
    defaultLayout: 'main'
  }))

  app.set('view engine', 'handlebars')
  app.use(express.static('public'))

  console.log('Express ready!')
}
