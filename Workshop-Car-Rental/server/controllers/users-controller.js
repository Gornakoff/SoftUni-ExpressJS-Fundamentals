const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')
// const User = require('../data/User')
const User = mongoose.model('User')
const Renting = mongoose.model('Renting')

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },
  registerPost: (req, res) => {
    let reqUser = req.body
    // add validations
    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

    let newUser = {
      username: reqUser.username,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      salt: salt,
      hashedPass: hashedPassword
    }

    User.create(newUser).then((user) => {
      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/register', user)
        }

        res.redirect('/')
      })
    })
  },
  loginGet: (req, res) => {
    res.render('users/login')
  },
  loginPost: (req, res) => {
    let reqUser = req.body

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
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  profile: (req, res) => {
    let userId = req.user._id

    Renting
      .find({ user: userId })
      .sort('-rentedOn')
      .populate('car')
      .then(rentings => {
        res.render('users/profile', {
          rentings: rentings
        })
      })
  }
}
