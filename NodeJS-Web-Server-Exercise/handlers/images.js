const database = require('../config/database')
const fs = require('fs')
const path = require('path')
const qs = require('querystring')

module.exports = (req, res) => {
  let splitUrl = req.pathname.split('/')
  let imageIndex = splitUrl[splitUrl.length - 1]

  if (req.pathname === '/images/add' && req.method === 'GET') {
    let filePath = path.normalize(path.join(__dirname, '../views/images/add.min.html'))
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err)
        return
      }

      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.write(data)
      res.end()
    })
  } else if (req.pathname === '/images/add' && req.method === 'POST') {
    let dataString = ''

    req.on('data', (data) => {
      dataString += data
    })
    req.on('end', () => {
      let image = qs.parse(dataString)
      database.images.add(image)

      res.writeHead(302, {
        Location: '/'
      })
      res.end()
    })
  } else if (req.pathname === '/images/all' && req.method === 'GET') {
    let filePath = path.normalize(path.join(__dirname, '../views/images/show-all.min.html'))
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err)
        return
      }

      res.writeHead(200, {
        'Content-Type': 'text/html'
      })

      let images = database.images.getAll()
      for (let image in images) {
        images[image].index = image
      }
      images.sort((a, b) => a.name > b.name)

      let content = ''
      for (let image of images) {
        // <img class="image-img" src="${image.url}">
        content += `
        <div class="list">
        <h2><a href="/images/details/${image.index}">${image.name}</a></h2>
        </div>`
      }

      let html = data.toString().replace('{content}', content)

      res.write(html)
      res.end()
    })
  } else if (req.pathname === `/images/details/${imageIndex}` && req.method === 'GET') {
    let filePath = path.normalize(path.join(__dirname, '../views/images/details.html'))
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err)
        return
      }

      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      let images = database.images.getAll()
      let image = images[imageIndex]

      let content = `
        <div class="image-card">
        <h2>${image.name}</h2>
        <img src="${image.url}">
        </div>`

      let html = data.toString().replace('{content}', content)

      res.write(html)
      res.end()
    })
  } else {
    return true
  }
}
