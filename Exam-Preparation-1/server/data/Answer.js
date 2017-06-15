const mongoose = require('mongoose')
const REQUIRED_VALIDATION_MESSAGE = '{0} is required'

let answerSchema = new mongoose.Schema({
  answer: { type: String, required: REQUIRED_VALIDATION_MESSAGE.replace('{0}', 'Answer') },
  createdOn: { type: Date, default: Date.now() },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }
  thread: { type: String }
})

let Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer
