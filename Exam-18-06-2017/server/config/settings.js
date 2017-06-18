const path = require('path')
const dbName = 'messenger'
const port = process.env.PORT || 8888

let rootPath = path.normalize(path.join(__dirname, '/../../'))

module.exports = {
  development: {
    rootPath: rootPath,
    db: `mongodb://localhost:27017/${dbName}`,
    port: port
  },
  staging: {
  },
  production: {
  }
}
