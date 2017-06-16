const mongoose = require('mongoose')
const Answer = mongoose.model('Answer')
const Thread = mongoose.model('Thread')

// TODO: Add error handlers!!!
// const errorHandler = require('../utilities/error-handler')

module.exports = {
  addGet: (req, res) => {
    let id = req.params.id
    let userId
    if (req.user) {
      userId = req.user._id
    }
    let sortAnswersBy = '-createdOn'

    // count views
    Thread
      .findById(id)
      .then(thread => {
        thread.views = thread.views + 1

        thread
          .save()
          .then(() => {
            Thread
              .findById(id)
              .then(thread => {
                let liked = false
                let likesCount = thread.likes.length || 0

                if (thread.likes.indexOf(userId) >= 0) {
                  liked = true
                }

                Answer
                  .find({ thread: id })
                  .sort(sortAnswersBy)
                  .then(answers => {
                    res.render('answers/add', {
                      thread: thread,
                      answers: answers,
                      liked: liked,
                      likesCount: likesCount
                    })
                  })
              })
          })
      })
  },
  addPost: (req, res) => {
    let answerText = req.body.answer
    let threadId = req.params.id
    let userId = req.user._id

    let newAnswer = {
      answer: answerText,
      createdOn: new Date().toISOString(),
      author: userId,
      thread: threadId
    }

    Answer
      .create(newAnswer)
      .then(answer => {
        let ansId = answer._id

        Thread
          .findById(threadId)
          .then(thread => {
            thread.lastAnswerDate = new Date().toISOString()
            thread.answers.push(ansId)

            thread
              .save()
              .then(() => {
                res.redirect(`/post/${threadId}/${req.params.title}`)
              })
          })
      })
  },
  editGet: (req, res) => {
    let answerId = req.params.id

    Answer
      .findById(answerId)
      .then(answer => {
        if (!answer) {
          res.sendStatus(404)
          return
        }
        res.render('answers/edit', {
          answer: answer
        })
      })
  },
  editPost: (req, res) => {
    let answerId = req.params.id
    let editReq = req.body

    Answer
      .findById(answerId)
      .then(answer => {
        answer.answer = editReq.answer

        answer
          .save()
          .then(() => {
            res.redirect('/')
          })
      })
  },
  deleteGet: (req, res) => {
    let answerId = req.params.id

    Answer
      .findById(answerId)
      .then(answer => {
        if (!answer) {
          res.sendStatus(404)
          return
        }
        res.render('answers/delete', {
          answer: answer
        })
      })
  },
  deletePost: (req, res) => {
    let answerId = req.params.id

    Answer
      .findById(answerId)
      .then(answer => {
        let threadId = answer.thread

        Thread
          .findById(threadId)
          .then(thread => {
            let index = thread.answers.indexOf(answerId)
            if (index >= 0) {
              thread.answers.splice(index, 1)
            }

            thread
              .save()
              .then(() => {
                Answer
                  .remove({_id: answerId})
                  .then(() => {
                    res.redirect('/list')
                  })
              })
          })
      })
  }
}
