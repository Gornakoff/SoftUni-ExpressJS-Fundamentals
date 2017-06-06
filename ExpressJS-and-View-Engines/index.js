const config = require('./config/config')
const database = require('./config/database.config')
const express = require('express')
const port = 3336

let app = express()
let environment = process.env.NODE_environment || 'development'

database(config[environment])
require('./config/express')(app, config[environment])
require('./config/routes')(app)

app.listen(port)

console.log(`Server is running on port ${port}`)
