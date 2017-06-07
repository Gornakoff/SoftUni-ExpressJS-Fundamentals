const express = require('express')
const mongoose = require('mongoose')
const dbName = 'boilerplate'
const port = process.env.PORT || 1337
const env = process.env.NODE_ENV || 'development'

mongoose.Promise = global.Promise

let app = express()

app.get('/', (req, res) => {
  mongoose.connect(`mongodb://localhost:27017/${dbName}`)
    .then(() => {
      console.log('Connected to database!')
    })
  res.send('Hello!')
})

app.listen(port)
console.log(`Server is listening on port ${port}...`)
