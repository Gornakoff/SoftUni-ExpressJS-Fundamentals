const Car = require('mongoose').model('Car')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  addGet: (req, res) => {
    res.render('cars/add')
  },
  addPost: (req, res) => {
    let carReq = req.body

    if (req.pricePerDay <= 0) {
      res.locals.globalError = 'Price per day cannot be less than 0'
      res.render('cars/add', carReq)
    }

    let newCar = {
      make: carReq.make,
      model: carReq.model,
      year: carReq.year,
      pricePerDay: carReq.pricePerDay,
      power: carReq.power,
      image: carReq.image
    }

    Car
      .create(newCar)
      .then((car) => {
        res.redirect('/cars/all')
      })
      .catch((err) => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render('cars/add', carReq)
      })
  },
  all: (req, res) => {
    const sortByPropName = 'createdOn'

    let pageSize = 1
    let page = parseInt(req.query.page) || 1
    let search = req.query.search

    let query = Car.find({})
    if (search) {
      query = query.where('make').regex(new RegExp(search, 'i')) // case insensitive search
    }

    query
      .sort(`-${sortByPropName}`) // sort by property( createdOn ) in reverse order (using '-' symbol)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then((cars) => {
        res.render('cars/all', {
          cars: cars, // set variable for handlebars
          hasPrevPage: page > 1,
          hasNextPage: cars.length > 0,
          prevPage: page - 1,
          nextPage: page + 1,
          search: search
        })
      })
  }
}
