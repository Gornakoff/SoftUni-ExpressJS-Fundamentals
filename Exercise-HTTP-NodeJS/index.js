const storage = require('./storage')

storage.put('first', 'firstValue')
storage.put('second', 'secondValue')
storage.put('third', '3')

// let test = storage.get('first')
// console.log(test)

// storage.update('first', 'something')
// storage.delete('first')
// console.log(storage.get('first'))

// synchrony
// storage.save()
// storage.load()

// async
// storage.save()
//         .then(() => {
//           console.log('Saved')
//           // storage.clear()
//           // console.log(storage.get('second'))
//         })

storage.load()
        .then(() => {
          console.log('File loaded successfully!')
          // let loadedValue = storage.get('second')
          // console.log(loadedValue)
        })
