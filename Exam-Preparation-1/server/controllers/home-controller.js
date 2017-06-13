module.exports = {
  index: (req, res) => {
    if (req.query.success) {
      res.locals.success = req.query.success
    }

    res.render('home/index')
  },
  about: (req, res) => {
    res.render('home/about')
  }
}
