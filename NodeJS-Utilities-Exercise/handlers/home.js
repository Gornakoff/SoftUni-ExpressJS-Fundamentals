const fs = require('fs')
const path = require('path')
const database = require('../config/database')

module.exports = (req, res) => {
  if (req.pathname === '/' && req.method === 'GET') {
    let filePath = path.normalize(path.join(__dirname, '../views/home/index.html'))
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err)
        res.writeHead(404, {
          'Content-Type': 'text/html'
        })
        res.write('<h3>404 - Page not found!</h3>')
        res.end()
        return
      }

      res.writeHead(200, {
        'Content-Type': 'text/html'
      })

      let images = database.images.getAll()
      // images.sort((a, b) => a.name > b.name)

      let content = ''
      for (let image of images) {
        content += `
        <div class="image-card">
        <img class="image-img" src="${image.url}">
        <h2>${image.name}</h2>
        </div>`
      }

      let html = data.toString().replace('{content}', content)

      res.write(html)
      res.end()
    })
  } else {
    return true
  }
}
