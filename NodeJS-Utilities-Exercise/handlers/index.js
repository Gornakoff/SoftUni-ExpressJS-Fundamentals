const homePageHandler = require('./home')
const faviconHandler = require('./favicon')
const imagesHandeler = require('./images')
const staticFilesHandler = require('./static-files')

module.exports = [
  homePageHandler,
  faviconHandler,
  imagesHandeler,
  staticFilesHandler
]
