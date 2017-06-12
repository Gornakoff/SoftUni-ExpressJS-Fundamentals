const mongoose = require('mongoose')
const Car = mongoose.model('Car')
const Renting = mongoose.model('Renting')
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

    let pagesCount = 0
    let pageSize = 1
    let page = parseInt(req.query.page) || 1
    let search = req.query.search

    let query = Car.find({ isRented: false })
    let regexSearch = new RegExp(search, 'i') // matching case insensitive text

    if (search) {
      // query = query.where('make').regex(regexSearch) // search in one location
      query = query.or([{ make: regexSearch }, { model: regexSearch }]) // search in multiple locations
    }

    query.then(carsData => {
      pagesCount = Math.ceil(carsData.length / pageSize)

      query
        .sort(sortByPropName)
        // .sort(`-${sortByPropName}`) // sort by property( createdOn ) in reverse order (using '-' symbol)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .then((cars) => {
          res.render('cars/all', {
            cars: cars, // set variable for handlebars
            hasPrevPage: page > 1,
            hasNextPage: page < pagesCount,
            // hasNextPage: cars.length > 0,
            currentPage: page,
            prevPage: page - 1,
            nextPage: page + 1,
            isNotFirst: page > 2,
            isNotLast: page < pagesCount - 1,
            lastPage: pagesCount,
            search: search
          })
        })
    })
  },
  rent: (req, res) => {
    let userId = req.user._id
    let carId = req.params.id
    let days = parseInt(req.body.days)

    Car
      .findById(carId)
      .then(car => {
        if (car.isRented) {
          res.locals.globalError = 'Car is already rented!'
          res.render('cars/all')
          return
        }

        let rentCar = {
          user: userId,
          car: carId,
          days: days,
          totalPrice: car.pricePerDay * days
        }
        Renting
          .create(rentCar)
          .then(renting => {
            car.isRented = true
            car
              .save()
              .then(car => {
                res.redirect('/cars/all')
              })
          })
          .catch(err => {
            Renting.remove(rentCar)
            let message = errorHandler.handleMongooseError(err)
            res.locals.globalError = message
            res.render('cars/all')
          })
      })
      .catch(err => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render('cars/all')
      })
  }
}
