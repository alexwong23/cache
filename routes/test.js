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
router.route('/create')
      .get(userCheck, testController.getCreate)
      .post(testController.postCreate)

module.exports = router
