const mongoose = require('mongoose')
const Thread = mongoose.model('Thread')
const Answer = mongoose.model('Answer')
const Category = mongoose.model('Category')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  addGet: (req, res) => {
    Category
      .find({})
      .then(categories => {
        res.render('threads/add', {
          categories: categories
        })
      })
  },
  addPost: (req, res) => {
    let threadReq = req.body
    let userId = req.user._id

    let newThread = {
      title: threadReq.title,
      description: threadReq.description,
      lastAnswerDate: new Date().toISOString(),
      createdOn: new Date().toISOString(),
      author: userId,
      category: threadReq.category
    }

    Thread
      .create(newThread)
      .then(thread => {
        res.redirect('/')
      })
      .catch(error => {
        let message = errorHandler.handleMongooseError(error)
        res.locals.globalError = message
        res.render('threads/add', threadReq)
      })
  },
  list: (req, res) => {
    const sortBy = '-lastAnswerDate'

    let pagesCount = 0
    let pageSize = 1
    let page = parseInt(req.query.page) || 1

    Thread
      .find({})
      .then(threads => {
        pagesCount = Math.ceil(threads.length / pageSize)
      })

    Thread
      .find({})
      .sort(sortBy)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(threads => {
        res.render('threads/list', {
          threads: threads,
          hasPrevPage: page > 1,
          hasNextPage: page < pagesCount,
          currentPage: page,
          prevPage: page - 1,
          nextPage: page + 1,
          isNotFirst: page > 2,
          isNotLast: page < pagesCount - 1,
          lastPage: pagesCount
        })
      })
  },
  deleteGet: (req, res) => {
    let threadId = req.params.id

    Thread
      .findById(threadId)
      .then(thread => {
        if (!thread) {
          res.sendStatus(404)
          return
        }
        res.render('threads/delete', {
          thread: thread
        })
      })
  },
  deletePost: (req, res) => {
    let threadId = req.params.id

    Thread
      .findById(threadId)
      .then((thread) => {
        for (let answer of thread.answers) {
          Answer
            // .findOneAndRemove({thread: threadId})
            .findByIdAndRemove(answer)
            .then(() => {
              // console.log(`Answer ${answer} Deleted`)
            })
        }
      })
      .then(() => {
        Thread
          .remove({ _id: threadId })
          .then(() => {
            res.redirect('/list')
          })
      })
  },
  editGet: (req, res) => {
    let threadId = req.params.id

    Category
      .find({})
      .then(categories => {
        Thread
          .findById(threadId)
          .then(thread => {
            if (!thread) {
              res.sendStatus(404)
              return
            }
            res.render('threads/edit', {
              thread: thread,
              categories: categories
            })
          })
      })
  },
  editPost: (req, res) => {
    let threadId = req.params.id
    let editReq = req.body

    Thread
      .findById(threadId)
      .then(thread => {
        thread.title = editReq.title
        thread.description = editReq.description

        if (thread.category !== editReq.category) {
          thread.category.splice(0, 1)
          thread.category.push(editReq.category)
        }

        thread
          .save()
          .then(() => {
            res.redirect('/list')
          })
      })
  },
  like: (req, res) => {
    let threadId = req.params.id
    let userId = req.user._id

    Thread
      .findById(threadId)
      .then(thread => {
        thread.views = thread.views - 1
        thread.likes.push(userId)

        thread
          .save()
          .then(() => {
            res.redirect(`/post/${thread._id}/${thread.title}`)
          })
      })
  },
  dislike: (req, res) => {
    let threadId = req.params.id
    let userId = req.user._id

    Thread
      .findById(threadId)
      .then(thread => {
        let index = thread.likes.indexOf(userId)

        if (index >= 0) {
          thread.likes.splice(index, 1)
        }
        thread.views = thread.views - 1

        thread
          .save()
          .then(() => {
            res.redirect(`/post/${thread._id}/${thread.title}`)
          })
      })
  }
}
