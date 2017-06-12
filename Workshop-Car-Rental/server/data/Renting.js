const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required!'

let rentingSchema = new mongoose.Schema({
  user: { type: ObjectId, required: REQUIRED_VALIDATION_MESSAGE, ref: 'User' },
  car: { type: ObjectId, required: REQUIRED_VALIDATION_MESSAGE, ref: 'Car' },
  rentedOn: { type: Date, default: Date.now() },
  days: { type: Number, required: REQUIRED_VALIDATION_MESSAGE },
  totalPrice: { type: Number, required: REQUIRED_VALIDATION_MESSAGE }
})

let Renting = mongoose.model('Renting', rentingSchema)

module.exports = Renting
