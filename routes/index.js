var express = require('express')
var router = express.Router()
var passport = require('passport')

var indexController = require('../controller/indexController')

// login check function
// if user already login, redirect homepage with flash
// if user is not login, allow codes to continue
function loginCheck (req, res, next) {
  if (req.isAuthenticated(req, res, next)) {
    req.flash('homeMessage', 'You are already logged in!')
    return res.redirect('/')
  } else {
    return next()
  }
}

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

// login route with get and post, post with passport
router.route('/login')
.get(loginCheck, indexController.getLogin)
.post(passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

// functions in indexController
router.get('/', userCheck, indexController.getHome)
router.get('/logout', userCheck, indexController.getLogout)

module.exports = router
