const fs = require('fs')
const path = require('path')

let serveFile = (fileType) => {
  let serveAllowed = false
  if (fileType === '.css' || fileType === '.html' || fileType === '.jpg' || fileType === '.js') {
    serveAllowed = true
  }
  return serveAllowed
}

let getContentType = (url) => {
  let contentType = 'text/plain'
  if (url.endsWith('.css')) {
    contentType = 'text/css'
  } else if (url.endsWith('.html')) {
    contentType = 'text/html'
  } else if (url.endsWith('.jpg')) {
    contentType = 'image/jpeg'
  } else if (url.endsWith('.js')) {
    contentType = 'application/javascript'
  }
  return contentType
}

module.exports = (req, res) => {
  if (req.pathname.startsWith('/content') && serveFile(path.extname(req.pathname))) {
    fs.readFile('.' + req.pathname, (err, data) => {
      if (err) {
        res.writeHead(404)
        res.write('Page not found')
        res.end()
        return
      }

      res.writeHead(200, {
        'Content-Type': getContentType(req.pathname)
      })
      res.write(data)
      res.end()
    })
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    })
    res.write('<h3>Bad request!</h3>')
    res.end()
  }
}
