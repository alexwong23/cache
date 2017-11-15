
// export functions to test route
var Test = require('../models/test')
var Question = require('../models/question')
var Attempt = require('../models/attempt')

module.exports = {
  getViewTest: function (req, res, next) {
    Test.findOne({'_id': req.params.id}).exec(function (err, testDetails) {
      if (err) { return next(err) }
      Question.find({'testid': testDetails._id}, function (err, testQuestions) {
        if (err) { return next(err) }
        res.render('test/viewTest', {
          message: req.flash('viewTestMessage'),
          testDetails: testDetails,
          testQuestions: testQuestions
        })
      })
    })
  },
  getCreateTest: function (req, res) {
    res.render('test/createTest', { message: req.flash('createTestMessage') })
  },
  postCreateTest: function (req, res, next) {
    Test.findOne({'title': req.body.test.title}).exec(function (err, duplicateFound) {
      if (err) { return next(err) }
      if (duplicateFound) {
        req.flash('createTestMessage', 'This title has been taken.')
        res.redirect('/tests/create/test')
      } else {
        var newTest = new Test({
          title: req.body.test.title,
          subject: req.body.test.subject,
          description: req.body.test.description,
          complete: true
        })
        newTest.save(function (err) {
          if (err) { return next(err) }
          req.flash('viewTestMessage', 'Test created!')
          res.redirect('/tests/view/' + newTest._id)
        })
      }
    })
  },
  getCreateQuestion: function (req, res, next) {
    Test.findOne({'_id': req.params.id}).exec(function (err, testDetails) {
      if (err) { return next(err) }
      res.render('test/createQuestion', {
        message: req.flash('createQuestionMessage'),
        testDetails: testDetails
      })
    })
  },
  postCreateQuestion: function (req, res, next) {
    var newQuestion
    if (req.body.question.format === 'mcq-single-option') {
      newQuestion = new Question({
        testid: req.params.id,
        format: req.body.question.format,
        content: req.body.question.content,
        answer: req.body.question.option1,
        option1: req.body.question.option1,
        option2: req.body.question.option2,
        option3: req.body.question.option3,
        option4: req.body.question.option4
      })
    } else if (req.body.question.format === 'true-false') {
      newQuestion = new Question({
        testid: req.params.id,
        format: req.body.question.format,
        content: req.body.question.content,
        answer: req.body.question.tfanswer
      })
    } else if (req.body.question.format === 'open-ended') {
      newQuestion = new Question({
        testid: req.params.id,
        format: req.body.question.format,
        content: req.body.question.content,
        answer: req.body.question.oeanswer
      })
    }
    newQuestion.save(function (err) {
      if (err) { return next(err) }
      Question.count({'testid': req.params.id}).exec(function (err, noOfQns) {
        if (err) { return next(err) }
        Test.findOneAndUpdate({'_id': req.params.id}, {'number_of_questions': noOfQns}).exec(function (err) {
          if (err) { return next(err) }
          res.redirect('/tests/edit/' + newQuestion.testid)
        })
      })
    })
  },
  getEditTestDetails: function (req, res, next) {
    Test.findOne({'_id': req.params.id}).exec(function (err, testDetails) {
      if (err) { return next(err) }
      res.render('test/editTestDetails', {
        message: req.flash('editTestDetailsMessage'),
        testDetails: testDetails
      })
    })
  },
  putEditTestDetails: function (req, res, next) {
    Test.findOne({'_id': {$ne: req.params.id}, 'title': req.body.test.title}).exec(function (err, duplicateFound) {
      if (err) { return next(err) }
      if (duplicateFound) {
        req.flash('editTestDetailsMessage', 'This title has been taken.')
        res.redirect('/tests' + req.url)
      } else {
        Test.findOneAndUpdate({'_id': req.params.id}, {
          title: req.body.test.title,
          subject: req.body.test.subject,
          description: req.body.test.description
        }).exec(function (err, updateTestDetails) {
          if (err) { return next(err) }
          res.redirect('/tests/edit/' + req.params.id)
        })
      }
    })
  },
  getEditQuestionDetails: function (req, res, next) {
    Question.findOne({'_id': req.params.questionid})
    .populate('testid')
    .exec(function (err, questionDetails) {
      if (err) { return next(err) }
      res.render('test/editQuestionDetails', {
        message: req.flash('editQuestionDetailsMessage'),
        questionDetails: questionDetails
      })
    })
  },
  putEditQuestionDetails: function (req, res, next) {
    if (req.body.question.format === 'mcq-single-option') {
      Question.findOneAndUpdate({'_id': req.params.questionid}, {
        format: req.body.question.format,
        content: req.body.question.content,
        answer: req.body.question.option1,
        option1: req.body.question.option1,
        option2: req.body.question.option2,
        option3: req.body.question.option3,
        option4: req.body.question.option4
      }).exec(function (err, updateQuestionDetails) {
        if (err) { return next(err) }
        res.redirect('/tests/edit/' + updateQuestionDetails.testid)
      })
    } else if (req.body.question.format === 'true-false') {
      Question.findOneAndUpdate({'_id': req.params.questionid}, {
        format: req.body.question.format,
        content: req.body.question.content,
        answer: req.body.question.tfanswer
      }).exec(function (err, updateQuestionDetails) {
        if (err) { return next(err) }
        res.redirect('/tests/edit/' + updateQuestionDetails.testid)
      })
    } else if (req.body.question.format === 'open-ended') {
      Question.findOneAndUpdate({'_id': req.params.questionid}, {
        format: req.body.question.format,
        content: req.body.question.content,
        answer: req.body.question.oeanswer
      }).exec(function (err, updateQuestionDetails) {
        if (err) { return next(err) }
        res.redirect('/tests/edit/' + updateQuestionDetails.testid)
      })
    }
  },
  getEditTestLinks: function (req, res, next) {
    Test.findOne({'_id': req.params.id}).exec(function (err, testDetails) {
      if (err) { return next(err) }
      Question.find({'testid': testDetails._id}, function (err, testQuestions) {
        if (err) { return next(err) }
        res.render('test/editTestLinks', {
          message: req.flash('editTestLinksMessage'),
          testDetails: testDetails,
          testQuestions: testQuestions
        })
      })
    })
  },
  getCreateAttempt: function (req, res, next) {
    Test.findOne({'_id': req.params.id}).exec(function (err, testDetails) {
      if (err) { return next(err) }
      Question.find({'testid': testDetails._id}, function (err, testQuestions) {
        if (err) { return next(err) }
        res.render('test/createAttempt', {
          message: req.flash('createAttemptMessage'),
          testDetails: testDetails,
          testQuestions: testQuestions
        })
      })
    })
  },
  postCreateAttempt: function (req, res, next) {
    var answerArray = []
    var score = {
      noOfCorrect: 0,
      noOfIncorrect: 0,
      noOfUnanswered: 0
    }
    // callback function to push object data into Array
    function convertIntoArray (target) {
      for (var i = 1; i <= Object.keys(target).length; i++) {
        var questionObject = {
          id: target['no' + i].id,
          answer: target['no' + i].answer
        }
        answerArray.push(questionObject)
      }
      return answerArray
    }
    // callback function to compare answers and calculate score
    function calculateScore (answerArray, questionArray) {
      answerArray.forEach(function (question) {
        if (question.answer === undefined || question.answer === '') {
          score.noOfUnanswered += 1
        } else {
          questionArray.forEach(function (answer) {
            if (answer.id === question.id) {
              if (answer.answer === question.answer) {
                score.noOfCorrect += 1
              } else {
                score.noOfIncorrect += 1
              }
            }
          })
        }
      })
    }
    Question.find({'testid': req.params.id}).exec(function (err, questionArray) {
      if (err) { return next(err) }
      convertIntoArray(req.body.question)
      calculateScore(answerArray, questionArray)
      var newAttempt = new Attempt({
        testid: req.params.id,
        number_of_correct: score.noOfCorrect,
        number_of_incorrect: score.noOfIncorrect,
        number_of_unanswered: score.noOfUnanswered,
        score: (score.noOfCorrect / (score.noOfCorrect + score.noOfIncorrect + score.noOfUnanswered)) * 100,
        submitted_answers: answerArray
      })
      newAttempt.save(function (err) {
        if (err) { return next(err) }
        req.flash('createAttemptMessage', 'Attempt Submitted. Results calculated.')
        res.redirect('/tests/create/attempt/' + req.params.id)
      })
    })
  }
}
