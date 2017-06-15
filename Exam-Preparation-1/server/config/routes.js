const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  // app.get('/about', auth.isAuthenticated, controllers.home.about) // added authentication route

  // User routings
  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)

  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)

  app.post('/users/logout', controllers.users.logout)

  app.get('/profile/:username', controllers.users.profile)

  // Thread routings
  app.get('/add', auth.isAuthenticated, controllers.threads.addGet)
  app.post('/add', auth.isAuthenticated, controllers.threads.addPost)

  app.get('/thread/delete/:id', auth.isInRole('Admin'), controllers.threads.deleteGet)
  app.post('/thread/delete/:id', auth.isInRole('Admin'), controllers.threads.deletePost)

  app.get('/thread/edit/:id', auth.isInRole('Admin'), controllers.threads.editGet)
  app.post('/thread/edit/:id', auth.isInRole('Admin'), controllers.threads.editPost)

  app.get('/list', controllers.threads.list)

  // Answer routings
  app.get('/post/:id/:title', controllers.answers.addGet)
  app.post('/post/:id/:title', auth.isAuthenticated, controllers.answers.addPost)

  app.get('/answer/delete/:id', auth.isInRole('Admin'), controllers.threads.deleteGet)
  app.post('/answer/delete/:id', auth.isInRole('Admin'), controllers.threads.deletePost)

  app.get('/answer/edit/:id', auth.isInRole('Admin'), controllers.answers.editGet)
  app.post('/answer/edit/:id', auth.isInRole('Admin'), controllers.answers.editPost)

  // Admin routings
  app.get('/admins/all', auth.isInRole('Admin'), controllers.admins.all)

  app.get('/admins/add', auth.isInRole('Admin'), controllers.admins.addGet)
  app.post('/admins/add', auth.isInRole('Admin'), controllers.admins.addPost)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
