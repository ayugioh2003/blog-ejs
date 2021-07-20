var express = require('express')
var router = express.Router()

/* GET home page. */
// guest
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/post', function (req, res, next) {
  res.render('post', { title: 'Express' })
})


// auth
router.get('/signup', function (req, res, next) {
  res.render('dashboard/signup', { title: 'Express' })
})

router.get('/signin', function (req, res, next) {
  res.render('dashboard/signup', { title: 'Express' })
})

module.exports = router
