const mongoose = require('mongoose')
const User = require('../data/User')

require('../data/Thread')
require('../data/Answer')

mongoose.Promise = global.Promise

module.exports = (settings) => {
  mongoose.connect(settings.db)

  let db = mongoose.connection

  db.once('open', (err) => {
    if (err) {
      throw err
    }
    console.log('Connected to MongoDB!')

    User.seedAdminUser()
  })
  db.on('error', (err) => {
    console.log(`Database error: ${err}`)
  })
}
