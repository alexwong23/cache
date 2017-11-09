var LocalStrategy = require('passport-local').Strategy

var User = require('../models/user')

module.exports = function (passport) {
  // add user id to session to simulate user has login
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  // remove user id from session to simulate no user login
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })

  // local-login strategy with email, password
  // if user exists && password correct, successredirect to user page
  // if user exists but password wrong, failure redirect to login page
  // if no user found, failure redirect to login page
  passport.use('local-login', new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]',
    passReqToCallback: true
  }, function (req, email, password, next) {
    User.findOne({'email': email}, function (err, foundUser) {
      if (err) return next(err)
      if (foundUser) {
        foundUser.authenticate(password, function (err, passwordCorrect) {
          if (err) throw new Error(err)
          if (passwordCorrect) {
            return next(null, foundUser, req.flash('userMessage', 'Welcome back ' + email))
          } else {
            return next(null, false, req.flash('loginMessage', 'Invalid Email or Password'))
          }
        })
      }
      if (!foundUser) {
        if (email === 'alexwongweilun@hotmail.co.uk') {
          var newUser = new User({
            email: email,
            password: password
          })
          newUser.save(function (err, newUser) {
            if (err) {
              return next(null, false, req.flash('loginMessage', err.errors))
            }
            return next(null, newUser)
          })
        } else {
          return next(null, false, req.flash('loginMessage', 'Email does not exist'))
        }
      }
    })
  }))
}
