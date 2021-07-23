var express = require('express')
var router = express.Router()
const firebaseAdminDb = require('../connections/firebase_admin')
const moment = require('moment')
const stringtags = require('striptags')
const convertPagination = require('../modules/convertPagination')

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
        if ('public' === article.status) {
          articles.push(article)
        }
      })
      articles.reverse()

      // 分頁
      const data = convertPagination(articles, currentPage)
      console.log('data', data)
      // 分頁邏輯結束

      res.render('index', {
        title: 'Express',
        page: data.page,
        articles: data.data,
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

  let articleSnapshot = await articlesRef.child(id).once('value')
  let article = articleSnapshot.val()

  console.log('categories', categories)
  console.log('article landing in before', article)

  if (!article) {
    const reqUrl = req.originalUrl
    const isUrlFromDashboard =
      reqUrl.indexOf('/dashboard') > -1 || reqUrl.indexOf('/auth') > -1
    console.log('isUrlFromDashboard', isUrlFromDashboard)

    return res.render('error', {
      title: '找不到該文章',
      isUrlFromDashboard,
    })
  } else {
    // 增加文章閱讀次數
    const read_count = article.read_count || 0
    articlesRef
      .child(id)
      .update({ read_count: read_count + 1 })
  }

  articleSnapshot = await articlesRef.child(id).once('value')
  article = articleSnapshot.val()
  console.log('article read_count after', article.read_count)

  res.render('post', {
    title: 'Express',
    categories,
    article,
    moment,
    stringtags,
  })
})

// category
router.get('/categories', function (req, res, next) {
  let categories = {}
  const articles = []
  let currentPage = Number.parseInt(req.query.page) || 1

  categoriesRef
    .once('value')
    .then(function (snapshot) {
      categories = snapshot.val()
      console.log('categories', categories)
      return articlesRef.orderByChild('update_time').once('value')
    })
    .then(function (snapshot) {
      snapshot.forEach(function (snapshotChild) {
        const article = snapshotChild.val()
        if ('public' === article.status) {
          articles.push(article)
        }
      })
      articles.reverse()

      // 分頁
      // const data = convertPagination(articles, currentPage)
      // console.log('data', data)
      // 分頁邏輯結束

      res.render('categories', {
        title: 'Express',
        // page: data.page,
        // articles: data.data,
        articles,
        categories,
        stringtags,
        moment,
      })
    })
})
router.get('/category/:id', function (req, res, next) {
  let categories = {}
  const articles = []
  let currentPage = Number.parseInt(req.query.page) || 1

  categoriesRef
    .once('value')
    .then(function (snapshot) {
      categories = snapshot.val()
      console.log('categories', categories)
      return articlesRef.orderByChild('update_time').once('value')
    })
    .then(function (snapshot) {
      snapshot.forEach(function (snapshotChild) {
        const article = snapshotChild.val()
        if ('public' === article.status && article.category === req.params.id) {
          articles.push(article)
        }
      })
      articles.reverse()

      // 分頁
      const data = convertPagination(articles, currentPage)
      console.log('data', data)
      // 分頁邏輯結束

      res.render('category', {
        title: 'Express',
        page: data.page,
        articles: data.data,
        category: req.params.id,
        categories,
        stringtags,
        moment,
      })
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
