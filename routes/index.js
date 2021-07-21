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
  let currentPage = Number.parseInt(req.query.page) || 1

  categoriesRef
    .once('value')
    .then(function (snapshot) {
      categories = snapshot.val()
      return articlesRef.orderByChild('update_time').once('value')
    })
    .then(function (snapshot) {
      snapshot.forEach(function (snapshotChild) {
        const article = snapshotChild.val()
        if (('public' === article.status)) {
          articles.push(article)
        }
      })
      articles.reverse()

      // 分頁
      const totalResult = articles.length
      const perpage = 3
      const pageTotal = Math.ceil(totalResult / perpage)

      if (currentPage > pageTotal) {
        currentPage = pageTotal
      }

      const minItem = (currentPage - 1) * perpage + 1
      const maxItem = currentPage * perpage

      const data = []
      articles.forEach(function (item, i) {
        let itemNum = i + 1
        if (itemNum >= minItem && itemNum <= maxItem) {
          data.push(item)
        }
      })
      const page = {
        pageTotal,
        currentPage,
        hasPre: currentPage > 1,
        hasNext: currentPage < pageTotal
      }

      console.log('page', page)
      // 分頁邏輯結束

      res.render('index', {
        title: 'Express',
        page,
        articles: data,
        categories,
        stringtags,
        moment,
      })
    })
})


// post
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
