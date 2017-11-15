var express = require('express')
var router = express.Router()

var testController = require('../controller/testController')

// user check function
// if user is already login, allow codes to continue
// if user is not login, redirect to login page with flash
function userCheck (req, res, next) {
  if (req.isAuthenticated(req, res, next)) {
    return next()
  } else {
    req.flash('loginMessage', 'Please login to continue')
    return res.redirect('/login')
  }
}

// functions in testController

// View Test & Questions
router.get('/view/:id', userCheck, testController.getViewTest)

// Create & Post Test
router.route('/create/test')
      .get(userCheck, testController.getCreateTest)
      .post(testController.postCreateTest)

// Create & Post Question
router.route('/create/question/:id')
      .get(userCheck, testController.getCreateQuestion)
      .post(testController.postCreateQuestion)

// Edit Test Details
router.route('/edit/test/:id')
      .get(userCheck, testController.getEditTestDetails)
      .put(testController.putEditTestDetails)

// Edit Question Details
router.route('/edit/question/:questionid')
      .get(userCheck, testController.getEditQuestionDetails)
      .put(testController.putEditQuestionDetails)

// View Test & Questions with links to edit & add questions
router.get('/edit/:id', userCheck, testController.getEditTestLinks)

// Create & Post Attempt
router.route('/create/attempt/:id')
      .get(userCheck, testController.getCreateAttempt)
      .post(testController.postCreateAttempt)

module.exports = router
