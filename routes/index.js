var express = require('express')
var router = express.Router()
const firebaseAdminDb = require('../connections/firebase_admin')
const moment = require('moment')
const stringtags = require('striptags')

const categoriesRef = firebaseAdminDb.ref('categories')
const articlesRef = firebaseAdminDb.ref('articles')

/* GET home page. */
// guest
router.get('/', function (req, res, next) {
  let categories = {}
  const articles = []

  const status = req.query.status || 'public'
  console.log('status', status)

  categoriesRef
    .once('value')
    .then(function (snapshot) {
      categories = snapshot.val()
      return articlesRef.orderByChild('update_time').once('value')
    })
    .then(function (snapshot) {
      snapshot.forEach(function (snapshotChild) {
        const article = snapshotChild.val()
        if ((status === article.status)) {
          articles.push(article)
        }
      })
      articles.reverse()

      res.render('index', {
        title: 'Express',
        articles,
        categories,
        stringtags,
        moment,
        status,
      })
    })
})

router.get('/post', function (req, res, next) {
  res.render('post', { title: 'Express' })
})
router.get('/post/:id', async function (req, res, next) {
  const id = req.params.id
  const categoriesSnapshot = await categoriesRef.once('value')
  const categories = categoriesSnapshot.val()

  const articlesSnapshot = await articlesRef.child(id).once('value')
  const article = articlesSnapshot.val()

  console.log('categories', categories)
  console.log('article', article)

  res.render('post', {
    title: 'Express',
    categories,
    article,
    moment,
    stringtags
  })
})


// auth
router.get('/signup', function (req, res, next) {
  res.render('dashboard/signup', { title: 'Express' })
})

router.get('/signin', function (req, res, next) {
  res.render('dashboard/signup', { title: 'Express' })
})

module.exports = router
