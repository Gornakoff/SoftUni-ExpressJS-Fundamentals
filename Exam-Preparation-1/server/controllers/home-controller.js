const mongoose = require('mongoose')
const Thread = mongoose.model('Thread')

module.exports = {
  index: (req, res) => {
    if (req.query.success) {
      res.locals.success = req.query.success
    }

    const sortBy = '-lastAnswerDate'
    const limitCount = 20

    Thread
      .find({})
      .sort(sortBy)
      .limit(limitCount)
      .then(threads => {
        res.render('home/index', {
          threads: threads
        })
      })
  },
  about: (req, res) => {
    res.render('home/about')
  }
}
