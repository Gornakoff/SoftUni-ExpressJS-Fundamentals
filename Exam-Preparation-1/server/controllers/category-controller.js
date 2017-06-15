const mongoose = require('mongoose')
const Category = mongoose.model('Category')

module.exports = {
  addGet: (req, res) => {
    res.render('categories/add')
  },
  addPost: (req, res) => {
    let categoryName = req.body.name
    let userId = req.user._id

    let newCategory = {
      name: categoryName,
      creator: userId,
      createdOn: new Date().toISOString()
    }

    Category
      .create(newCategory)
      .then(() => {
        res.redirect('/')
      })
  },
  deleteGet: (req, res) => {
    let categoryId = req.params.id

    Category
      .findById(categoryId)
      .then(category => {
        if (!category) {
          res.sendStatus(404)
          return
        }
        res.render('categories/delete', {
          category: category
        })
      })
  },
  deletePost: (req, res) => {
    let categoryId = req.params.id

    Category
      .remove({ _id: categoryId })
      .then(() => {
        res.redirect('/categories')
      })
  },
  list: (req, res) => {
    Category
      .find({})
      .then(categories => {
        res.render('categories/list', {
          categories: categories
        })
      })
  }
}
