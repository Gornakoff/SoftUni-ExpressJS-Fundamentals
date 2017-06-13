module.exports = {
  handleMongooseError: (err) => {
    let errKeys = Object.keys(err.errors)
    let key = errKeys[errKeys.length - 1]
    let message = err.errors[key].message

    return message
  }
}
