const database = require('./config/database.config')
const config = require('./config/config')
let localEnv = 'development'

let environment = process.env.NODE_ENV || localEnv

database(config[environment], config.port)
