const mongoose = require('mongoose')
const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let carSchema = new mongoose.Schema({
  make: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  model: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  year: { type: Number, required: REQUIRED_VALIDATION_MESSAGE },
  // pricePerDay: { type: Number, required: true, min: 0.00 },
  pricePerDay: { type: Number, required: REQUIRED_VALIDATION_MESSAGE },
  power: { type: Number },
  createdOn: { type: Date, default: Date.now() },
  image: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  isRented: { type: Boolean, default: false }
})

let Car = mongoose.model('Car', carSchema)

module.exports = Car
