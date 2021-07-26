var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var session = require('express-session')
var flash = require('connect-flash')

var indexRouter = require('./routes/index')
var authRouter = require('./routes/auth')
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
app.use(
  session({
    secret: 'keyboardcat',
    resave: true,
    saveUninitialized: true,
    // cookie: {
    //   // secure: true,
    //   maxAge: 100 * 1000,
    // },
  })
)
app.use(flash())

const authCheck = async function (req, res, next) {
  console.log('middleware', req.session)
  console.log('url', req.originalUrl)

  const whiteRoles = ['editor']
  const adminRoutes = ['/dashboard/users', '/dashboard/roles']
  const isAdmin = req.session.role === 'admin'
  
  const isAdminRoute = adminRoutes.indexOf(req.originalUrl) !== -1
  const isWhiteRole = whiteRoles.indexOf(req.session.role) !== -1
  const isOtherRolesLogable = isWhiteRole && !isAdminRoute

  console.log('isAdmin', isAdmin)
  console.log('isAdminRoute', isAdminRoute)
  console.log('isOtherRolesLogable', isOtherRolesLogable)

  const isLogable = isAdmin || isOtherRolesLogable
  console.log('isLogable', isLogable)

  if (isLogable) {
    return next()
  }

  // const adminUid = process.env.ADMIN_UID
  // if (req.session.uid === adminUid) {
  //   return next()
  // }

  return res.redirect('/auth/signin')
}

app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/dashboard', authCheck, dashboardRouter)
// app.use('/dashboard', authCheck, dashboardRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const reqUrl = req.originalUrl
  const isUrlFromDashboard =
    reqUrl.indexOf('/dashboard') > -1 || reqUrl.indexOf('/auth') > -1
  console.log('isUrlFromDashboard', isUrlFromDashboard)

  var err = new Error('Not Found')
  err.status = 404
  res.render('error', {
    title: '您所查看的頁面不存在:(',
    isUrlFromDashboard,
  })
  // next(createError(404))
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
