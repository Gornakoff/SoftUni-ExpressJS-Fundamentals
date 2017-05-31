const http = require('http')
const handlers = require('./handlers')
const url = require('url')
const port = 2222

http
  .createServer((req, res) => {
    req.pathname = req.pathname || url.parse(req.url).pathname

    for (let handler of handlers) {
      let nextHandler = handler(req, res)
      if (!nextHandler) {
        break
      }
    }
    // console.log(req.pathname)
  })
  .listen(port)

console.log(`Server is UP and running on port ${port}`)
