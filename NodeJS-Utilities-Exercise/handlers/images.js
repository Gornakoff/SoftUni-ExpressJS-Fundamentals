const database = require('../config/database')
const fs = require('fs')
const path = require('path')
const formidable = require('formidable')

let folderNumber = 1

function isDirectoryExists (dirname) {
  try {
    return fs.statSync(dirname).isDirectory()
  } catch (e) {
    return false
  }
}

module.exports = (req, res) => {
  let splitUrl = req.pathname.split('/')
  let imageIndex = splitUrl[splitUrl.length - 1]

  if (req.pathname === '/images/add' && req.method === 'GET') {
    let filePath = path.normalize(path.join(__dirname, '../views/images/add.html'))
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
    // let dataString = ''
    let form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files) => {
      console.log(fields)
      if (err) {
        console.log(err)
        return
      }

      let destFolder = `./content/images/images-${folderNumber}`
      let uploadImage = files['fileName']
      let imageInfo = {}

      if (!isDirectoryExists(destFolder)) {
        fs.mkdirSync(destFolder)
      }
      let readStream = fs.createReadStream(uploadImage.path)
      let writeStream = fs.createWriteStream(destFolder + '/' + uploadImage.name)

      if (folderNumber === 2) {
        folderNumber = 0
      }
      folderNumber += 1

      readStream
        .pipe(writeStream)

      readStream.on('error', (err) => {
        console.log(err)
      })
      readStream.on('end', () => {
        imageInfo.name = fields.name
        imageInfo.url = destFolder + '/' + uploadImage.name
        database.images.add(imageInfo)

        res.writeHead(302, {
          Location: '/'
        })
        res.end()
      })
    })
  } else if (req.pathname === '/images/all' && req.method === 'GET') {
    let filePath = path.normalize(path.join(__dirname, '../views/images/show-all.html'))
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
        <div class="image-card">
        <img class="image-img" src="../${image.url}">
        <h2><a href="/images/details/${image.index}">Download</a></h2>
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
