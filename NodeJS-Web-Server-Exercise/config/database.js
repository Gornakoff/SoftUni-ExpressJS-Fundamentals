const fs = require('fs')
const path = require('path')
const dbPath = path.normalize(path.join(__dirname, '/database.json'))

function getImages () {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '[]')
    return []
  }
  let json = fs.readFileSync(dbPath).toString() || '[]'
  let images = JSON.parse(json)
  return images
}

function saveImages (images) {
  let json = JSON.stringify(images)
  fs.writeFileSync(dbPath, json)
}

module.exports.images = {}
module.exports.images.getAll = getImages
module.exports.images.add = (image) => {
  let images = getImages()
  // image.id = images.length + 1
  images.push(image)
  saveImages(images)
}
