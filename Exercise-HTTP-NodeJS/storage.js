const fs = require('fs')
const dataFile = 'storage.dat'

let data = {}

let validateKeyAsString = (key) => {
  if (typeof key !== 'string') {
    throw new Error('Key must be a string')
  }
}

let validateKeyExist = (key) => {
  if (!data.hasOwnProperty(key)) {
    throw new Error('Key could not be found')
  }
}

let put = (key, value) => {
  validateKeyAsString(key)

  if (data.hasOwnProperty(key)) {
    throw new Error('Key already exist')
  }

  data[key] = value

  console.log(data)
}

let get = (key) => {
  validateKeyAsString(key)
  validateKeyExist(key)

  return data[key]
}

let update = (key, value) => {
  validateKeyAsString(key)
  validateKeyExist(key)

  data[key] = value
  console.log(data)
}

let deleteItem = (key) => {
  validateKeyAsString(key)
  validateKeyExist(key)

  delete data[key]
}
let clear = () => {
  data = {}
}

let save = (callback) => {
  // async
  return new Promise((resolve, reject) => {
    let dataAsString = JSON.stringify(data)

    fs.writeFile(dataFile, dataAsString, (err) => {
      if (err) {
        reject(err)
        return
      }

      resolve()
    })
  })

  // synchrony
  // fs.writeFileSync(dataFile, dataAsString)
}
let load = (callback) => {
  // async
  return new Promise((resolve, reject) => {
    fs.readFile(dataFile, 'utf8', (err, dataJSON) => {
      if (err) {
        reject(err)
      }

      data = JSON.parse(dataJSON)
      resolve()
    })
  })
  // synchrony
  // let dataAsString = fs.readFileSync(dataFile, 'utf8')
  // data = JSON.parse(dataAsString)
}

module.exports = {
  put: put,
  get: get,
  update: update,
  delete: deleteItem,
  clear: clear,
  save: save,
  load: load
}
