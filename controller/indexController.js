
// export functions to index route

module.exports = {
  getLogin: function (req, res) {
    res.render('login', { message: req.flash('loginMessage') })
  },
  getHome: function (req, res) {
    res.render('index', { message: req.flash('homeMessage') })
  },
  getLogout: function (req, res) {
    req.logout()
    res.redirect('/')
  }
}
