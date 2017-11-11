
// export functions to test route

var Test = require('../models/test')

module.exports = {
  getCreate: function (req, res) {
    res.render('test/create', { message: req.flash('createMessage') })
  },
  postCreate: function (req, res, next) {
    Test.find({'title': req.body.test.title}).exec(function (err, duplicateFound) {
      if (err) { return next(err) }
      if (duplicateFound) {
        req.flash('createMessage', 'This title has been taken.')
        res.redirect('/tests/create')
      } else {
        var newTest = new Test({
          title: req.body.test.title,
          subject: req.body.test.subject,
          description: req.body.test.description,
          number_of_questions: req.body.test.number_of_questions,
          complete: true
        })
        newTest.save(function (err) {
          if (err) { return next(err) }
          req.flash('homeMessage', 'Test created!')
          res.redirect('/')
        })
      }
    })
  },
  getEditDetails: function (req, res, next) {
    var testid = req.url.replace('/edit/', '')
    Test.findOne({'_id': testid}).exec(function (err, testDetails) {
      if (err) { return next(err) }
      res.render('test/edit', {
        message: req.flash('editDetailsMessage'),
        testDetails: testDetails
      })
    })
  },
  putEditDetails: function (req, res, next) {
    var testid = req.url.replace('/edit/', '')
    Test.findOne({'title': req.body.test.title}).exec(function (err, duplicateFound) {
      if (err) { return next(err) }
      if (duplicateFound) {
        req.flash('editDetailsMessage', 'This title has been taken.')
        res.redirect('/tests' + req.url)
      } else {
        Test.findOneAndUpdate({'_id': testid}, {
          title: req.body.test.title,
          subject: req.body.test.subject,
          description: req.body.test.description,
          number_of_questions: req.body.test.number_of_questions
        }).exec(function (err, updateTestDetails) {
          if (err) { return next(err) }
          res.redirect('/tests/' + testid)
        })
      }
    })
  },
  getDetails: function (req, res, next) {
    var testid = req.url.replace('/', '')
    Test.findOne({'_id': testid}).exec(function (err, testDetails) {
      if (err) { return next(err) }
      res.render('test/details', { testDetails: testDetails })
    })
  }
}
