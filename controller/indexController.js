
// export functions to index route

var Test = require('../models/test')

module.exports = {
  getLogin: function (req, res) {
    res.render('login', { message: req.flash('loginMessage') })
  },
  getHome: function (req, res, next) {
    Test.find({'complete': true}).sort({'_id': -1}).exec(function (err, testsArr) {
      if (err) { return next(err) }
      res.render('index', {
        message: req.flash('homeMessage'),
        testsArr: testsArr
      })
    })
  },
  getLogout: function (req, res) {
    req.logout()
    res.redirect('/')
  }
}
