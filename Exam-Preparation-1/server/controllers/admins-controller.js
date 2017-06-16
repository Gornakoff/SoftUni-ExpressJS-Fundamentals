const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = {
  all: (req, res) => {
    User
      .find({ roles: 'Admin' })
      .then(admins => {
        if (!admins) {
          res.sendStatus(404)
          return
        }
        res.render('admins/all', {
          admins: admins
        })
      })
  },
  addGet: (req, res) => {
    res.render('admins/add')
  },
  addPost: (req, res) => {
    let username = req.body.username
    let role = 'Admin'

    User
      .findOne({ username: username })
      .then(user => {
        if (!user) {
          res.sendStatus(404)
          return
        }
        user.roles.push(role)

        user
          .save()
          .then(() => {
            res.redirect('/admins/all')
          })
      })
  },
  blockUser: (req, res) => {
    let userId = req.params.id

    User
      .findById(userId)
      .then(user => {
        user.blocked = true

        user
          .save()
          .then(() => {
            res.redirect('/users/all')
          })
      })
  },
  unblockUser: (req, res) => {
    let userId = req.params.id

    User
      .findById(userId)
      .then(user => {
        user.blocked = false

        user
          .save()
          .then(() => {
            res.redirect(`/users/all`)
          })
      })
  }
}
