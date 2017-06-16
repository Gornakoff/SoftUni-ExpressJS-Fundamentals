const mongoose = require('mongoose')
const REQUIRED_VALIDATION_MESSAGE = '{0} is required'

let threadSchema = new mongoose.Schema({
  title: { type: String, required: REQUIRED_VALIDATION_MESSAGE.replace('{0}', 'Title') },
  description: { type: String, required: REQUIRED_VALIDATION_MESSAGE.replace('{0}', 'Description') },
  createdOn: { type: Date, default: Date.now() },
  lastAnswerDate: { type: Date, default: Date.now() },
  answers: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Answer' } ],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  // category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
  category: [{ type: String }]
})

let Thread = mongoose.model('Thread', threadSchema)

module.exports = Thread
