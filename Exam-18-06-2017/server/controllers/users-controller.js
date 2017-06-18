const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')
const errorHandler = require('../utilities/error-handler')
const User = mongoose.model('User')

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },
  registerPost: (req, res) => {
    let reqUser = req.body
    // add validations
    let salt = encryption.generateSalt()

    if (reqUser.password && reqUser.password !== reqUser.confirmPassword) {
      res.locals.globalError = 'Passwords do not match!'
      res.render('users/register', reqUser)
      return
    }

    if (reqUser.password) {
      let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)
      reqUser.password = hashedPassword
    }

    let newUser = {
      username: reqUser.username,
      password: reqUser.password,
      salt: salt,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName
    }

    User
      .create(newUser)
      .then((user) => {
        req.logIn(user, (err, user) => {
          if (err) {
            let message = errorHandler.handleMongooseError(err)
            res.locals.globalError = message
            res.render('users/register', user)
          }

          res.redirect('/')
        })
      })
      .catch(error => {
        let message = errorHandler.handleMongooseError(error)
        res.locals.globalError = message
        res.render('users/register', newUser)
      })
  },
  loginGet: (req, res) => {
    res.render('users/login')
  },
  loginPost: (req, res) => {
    let reqUser = req.body

    if (reqUser.username.length > 0 && reqUser.password.length > 0) {
      User.findOne({username: reqUser.username}).then((user) => {
        if (!user) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }
        if (!user.authenticate(reqUser.password)) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        req.login(user, (err, user) => {
          if (err) {
            res.locals.globalError = err
            res.render('users/login')
            return
          }

          res.redirect('/')
        })
      })
    } else {
      if (reqUser.username.length === 0) {
        res.locals.globalError = 'Username is required!'
      } else {
        res.locals.globalError = 'Password is required!'
      }
      res.render('users/login', {
        username: reqUser.username
      })
    }
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  }
}
