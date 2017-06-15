const mongoose = require('mongoose')
const REQUIRED_VALIDATION_MESSAGE = '{0} is required'

let categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: REQUIRED_VALIDATION_MESSAGE.replace('{0}', 'Name'),
    unique: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdOn: {
    type: Date,
    default: Date.now()
  }
})

let Category = mongoose.model('Category', categorySchema)

module.exports = Category
