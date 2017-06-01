const http = require('http')
const port = 3333
const handlers = require('./handlers')
const config = require('./config/config')
const database = require('./config/database.config')

let environment = process.env.NODE_ENV || 'development'

database(config[environment])

http.createServer((req, res) => {
  // res.writeHead(200, {
  //   'Content-Type': 'text/plain'
  // })

  // res.write('Hello!')
  // res.end()
  for (let handler of handlers) {
    if (!handler(req, res)) {
      break
    }
  }
}).listen(port)

console.log(`Server is running on port ${port}`)
