// require modules & set to variables
var express = require('express')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var mongoose = require('mongoose')
var layout = require('express-ejs-layouts')
var dotenv = require('dotenv')
var flash = require('connect-flash')
var session = require('express-session')
var path = require('path')
var passport = require('passport')
var MongoStore = require('connect-mongo')(session)
// var morgan = require('morgan')

// set app to run express
// server variable for web socket at btm of page
var app = express()
var server = require('http').Server(app)

// connect mongoose to which environment
mongoose.Promise = global.Promise
console.log('the environment is on ' + process.env.NODE_ENV)
dotenv.load({path: '.env.' + process.env.NODE_ENV})
mongoose.connect(process.env.MONGO_URI, {
  useMongoClient: true
})

// comment out morgan to prevent clogging of terminal
// set view engine to ejs and use layout
// set session, initialize passport, session, flash
// store data in mongodb, use public folder
// app.use(morgan('dev'))
app.set('view engine', 'ejs')
app.use(layout)
app.use(session({
  secret: process.env.EXPRESS_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: process.env.MONGO_URI,
    autoReconnect: true
  })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')))

// set routes to variables
var indexRoutes = require('./routes/index')
var testRoutes = require('./routes/test')

// body parser to get req.body from web page
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// for passport
require('./config/passport')(passport)

// run methodOverride for all requests
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

// exclusively for getting external api
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// to call 'user' in ejs pages, depends on session user id
app.use(function (req, res, next) {
  res.locals.user = req.user
  next()
})

// connect routes to url
app.use('/', indexRoutes)
app.use('/tests', testRoutes)

// Handle 404
app.use(function (req, res) {
  res.status(404)
  res.render('error', {
    title: '404',
    error: 'Page not found :(',
    message: 'Unfortunately, this page does not exist.'
  })
})

// Handle 500
app.use(function (err, req, res, next) {
  res.status(500)
  res.render('error', {
    title: 500,
    error: err,
    message: 'An error occurred and your request could not be completed. Please try again or'
  })
})

// server listen if either on heroku or localhost
server.listen(process.env.PORT || 4000)
console.log('Server running at http://localhost:4000/')
