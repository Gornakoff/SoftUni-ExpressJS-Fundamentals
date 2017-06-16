const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')
const REQUIRED_VALIDATION_MESSAGE = '{0} is required'

let userSchema = new mongoose.Schema({
  username: { type: String, required: REQUIRED_VALIDATION_MESSAGE.replace('{0}', 'Username'), unique: true },
  password: { type: String, required: REQUIRED_VALIDATION_MESSAGE.replace('{0}', 'Password') },
  salt: { type: String },
  firstName: { type: String, required: REQUIRED_VALIDATION_MESSAGE.replace('{0}', 'First name') },
  lastName: { type: String, required: REQUIRED_VALIDATION_MESSAGE.replace('{0}', 'Last name') },
  roles: [ {type: String} ],
  blocked: { type: Boolean, default: false }
})

userSchema.method({
  authenticate: function (userPass) {
    return encryption.generateHashedPassword(this.salt, userPass) === this.password
  }
})

let User = mongoose.model('User', userSchema)

module.exports = User

module.exports.seedAdminUser = () => {
  User.find({}).then((users) => {
    if (users.length > 0) {
      return
    }

    let salt = encryption.generateSalt()
    let password = encryption.generateHashedPassword(salt, 'admin')

    User.create({
      username: 'admin',
      salt: salt,
      password: password,
      firstName: 'Admin',
      lastName: 'Admin',
      roles: ['Admin']
    })
  })
}
