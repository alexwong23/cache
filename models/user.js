var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password at least 6 characters']
  }
})

// before saving a new user, run this function
// generate salt 5 times
// bcrypt passport with generated salt
userSchema.pre('save', function (next) {
  var user = this
  bcrypt.genSalt(5, function (err, salt) {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

// passport method for authentication
// bcrypt input password and see if matches with existing hash password in db
userSchema.methods.authenticate = function (password, callback) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    callback(err, isMatch)
  })
}

var User = mongoose.model('User', userSchema)

module.exports = User
