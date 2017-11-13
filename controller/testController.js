
// export functions to test route

var Test = require('../models/test')
var Question = require('../models/question')

module.exports = {
  getCreate: function (req, res) {
    res.render('test/create', { message: req.flash('createTestMessage') })
  },
  postCreate: function (req, res, next) {
    Test.findOne({'title': req.body.test.title}).exec(function (err, duplicateFound) {
      if (err) { return next(err) }
      if (duplicateFound) {
        req.flash('createTestMessage', 'This title has been taken.')
        res.redirect('/tests/create')
      } else {
        var newTest = new Test({
          title: req.body.test.title,
          subject: req.body.test.subject,
          description: req.body.test.description,
          complete: true
        })
        newTest.save(function (err) {
          if (err) { return next(err) }
          req.flash('detailsMessage', 'Test created!')
          res.redirect('/tests/' + newTest._id)
        })
      }
    })
  },
  getEditTestDetails: function (req, res, next) {
    var testid = req.url.replace('/edit/', '')
    Test.findOne({'_id': testid}).exec(function (err, testDetails) {
      if (err) { return next(err) }
      res.render('test/edit', {
        message: req.flash('editTestDetailsMessage'),
        testDetails: testDetails
      })
    })
  },
  putEditTestDetails: function (req, res, next) {
    var testid = req.url.replace('/edit/', '')
    Test.findOne({'_id': {$ne: testid}, 'title': req.body.test.title}).exec(function (err, duplicateFound) {
      if (err) { return next(err) }
      if (duplicateFound) {
        req.flash('editTestDetailsMessage', 'This title has been taken.')
        res.redirect('/tests' + req.url)
      } else {
        Test.findOneAndUpdate({'_id': testid}, {
          title: req.body.test.title,
          subject: req.body.test.subject,
          description: req.body.test.description
        }).exec(function (err, updateTestDetails) {
          if (err) { return next(err) }
          res.redirect('/tests/' + testid)
        })
      }
    })
  },
  getQuestion: function (req, res, next) {
    var testid = req.url.replace('/question/', '')
    Test.findOne({'_id': testid}).exec(function (err, testDetails) {
      if (err) { return next(err) }
      res.render('test/question', {
        message: req.flash('questionMessage'),
        testDetails: testDetails
      })
    })
  },
  postQuestion: function (req, res, next) {
    var testid = req.url.replace('/question/', '')
    var newQuestion
    if (req.body.question.format === 'mcq-single-option') {
      newQuestion = new Question({
        testid: testid,
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
        testid: testid,
        format: req.body.question.format,
        content: req.body.question.content,
        answer: req.body.question.tfanswer
      })
    } else if (req.body.question.format === 'open-ended') {
      newQuestion = new Question({
        testid: testid,
        format: req.body.question.format,
        content: req.body.question.content,
        answer: req.body.question.oeanswer
      })
    }
    newQuestion.save(function (err) {
      if (err) { return next(err) }
      res.redirect('/tests/' + newQuestion.testid)
    })
  },
  getDetails: function (req, res, next) {
    var testid = req.url.replace('/', '')
    Test.findOne({'_id': testid}).exec(function (err, testDetails) {
      if (err) { return next(err) }
      Question.find({'testid': testDetails._id}, function (err, testQuestions) {
        if (err) { return next(err) }
        res.render('test/details', {
          message: req.flash('detailsMessage'),
          testDetails: testDetails,
          testQuestions: testQuestions
        })
      })
    })
  }
}
