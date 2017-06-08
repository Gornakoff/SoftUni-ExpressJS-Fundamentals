module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
    } else {
      // redirect not authenticated user to login page
      res.redirect('/user/login')
    }
  },
  isInRole: (role) => {
    return (req, res, next) => {
      if (req.user && req.user.roles.indexOf(role) > -1) {
        next()
      } else {
        // if not authorized -> login with proper account
        res.redirect('/user/login')
      }
    }
  }
}
