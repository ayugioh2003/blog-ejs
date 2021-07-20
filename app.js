var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
// var firebaseAdminDb = require('./connections/firebase_admin')
// var firebase = require('./connections/firebase_client')

// const ref = firebaseAdminDb.ref('any')
// ref.once('value', function (snapshot) {
//   console.log('any', snapshot.val())
// })
// ref.once('value').then(function (snapshot) {
//   console.log('any', snapshot.val())
// })

// console.log('firebase', firebase)

var indexRouter = require('./routes/index')
var dashboardRouter = require('./routes/dashboard')

var app = express()

// view engine setup
app.engine('ejs', require('express-ejs-extend')) // add this line
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/dashboard', dashboardRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
