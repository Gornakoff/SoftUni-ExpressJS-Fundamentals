const fs = require('fs')
const faviconPath = '/favicon.ico'

module.exports = (req, res) => {
  if (req.pathname === faviconPath) {
    fs.readFile('content/images' + faviconPath, (err, data) => {
      if (err) {
        console.log(err)
        return
      }

      res.writeHead(200, {
        'Content-Type': 'image/x-icon'
      })
      res.write(data)
      res.end()
    })
  } else {
    return true
  }
}
