const express = require('express')
const router = express.Router()
const firebaseAdminDb = require('../connections/firebase_admin')
const moment = require('moment')
const stringtags = require('striptags')
const convertPagination = require('../modules/convertPagination')

const categoriesRef = firebaseAdminDb.ref('categories')
const articlesRef = firebaseAdminDb.ref('articles')
const usersRef = firebaseAdminDb.ref('users')
const rolesRef = firebaseAdminDb.ref('roles')

// archives
router.get('/archives', function (req, res, next) {
  let categories = {}
  const articles = []
  let currentPage = Number.parseInt(req.query.page) || 1

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
        if (status === article.status) {
          articles.push(article)
        }
      })
      articles.reverse()

      // 分頁
      const data = convertPagination(articles, currentPage)
      console.log('data', data)
      // 分頁

      res.render('dashboard/archives', {
        title: 'Express',
        page: data.page,
        articles: data.data,
        categories,
        stringtags,
        moment,
        status,
      })
    })
})

// article
router.get('/article', function (req, res, next) {
  res.render('dashboard/article', { title: 'Express' })
})
router.get('/article/create', async function (req, res, next) {
  const categoriesSnapshot = await categoriesRef.once('value')
  const categories = categoriesSnapshot.val()
  console.log('categories', categories)

  res.render('dashboard/article', {
    title: 'Express',
    categories,
  })
})
router.post('/article/create', function (req, res, next) {
  console.log(req.body)
  const data = req.body
  const articleRef = articlesRef.push()
  const key = articleRef.key
  const updateTime = Math.floor(Date.now() / 1000)

  data.id = key
  data.update_time = updateTime
  data.read_count = 0
  console.log('data', data)

  articleRef.set(data).then(function () {
    res.redirect(`/dashboard/article/${data.id}`)
  })
})
router.get('/article/:id', async function (req, res, next) {
  const id = req.params.id
  const categoriesSnapshot = await categoriesRef.once('value')
  const categories = categoriesSnapshot.val()

  const articlesSnapshot = await articlesRef.child(id).once('value')
  const article = articlesSnapshot.val()

  console.log('categories', categories)
  console.log('article', article)

  res.render('dashboard/article', {
    title: 'Express',
    categories,
    article,
  })
})
router.post('/article/update/:id', function (req, res, next) {
  console.log(req.body)
  const data = req.body
  const id = req.params.id
  const updateTime = Math.floor(Date.now() / 1000)

  data.update_time = updateTime
  console.log('data', data)

  articlesRef
    .child(id)
    .update(data)
    .then(function () {
      res.redirect(`/dashboard/article/${id}`)
    })
})
router.post('/article/delete/:id', function (req, res) {
  const id = req.params.id
  articlesRef.child(id).remove()
  req.flash('info', '文章已刪除')
  res.send('文章已刪除')
  res.end()
})

// categories
router.get('/categories', function (req, res, next) {
  const messages = req.flash('info')
  console.log('messages', messages)

  categoriesRef.once('value').then(function (snapshot) {
    const categories = snapshot.val()
    // console.log('categories', categories)
    res.render('dashboard/categories', {
      title: 'Express',
      messages,
      hasInfo: messages?.length > 0,
      categories,
    })
  })
})

router.post('/categories/create', async function (req, res) {
  const data = req.body
  // console.log('categories create data', data)

  const categoryRef = categoriesRef.push()
  const key = categoryRef.key
  data.id = key

  const pathSnapshot = await categoriesRef
    .orderByChild('path')
    .equalTo(data.path)
    .once('value')
  const nameSnapshot = await categoriesRef
    .orderByChild('name')
    .equalTo(data.name)
    .once('value')

  if (pathSnapshot.val() !== null) {
    req.flash('info', '已有相同路徑')
    res.redirect('/dashboard/categories')
  } else if (nameSnapshot.val() !== null) {
    req.flash('info', '已有相同分類名稱')
    res.redirect('/dashboard/categories')
  } else {
    categoryRef.set(data).then(function () {
      req.flash('info', '新增路徑成功')
      res.redirect('/dashboard/categories')
    })
  }
})

router.post('/categories/update/:id', async function (req, res) {
  const data = req.body
  const id = req.params.id
  const path = data.path
  const name = data.name
  console.log(`path: ${path}, name: ${name}, id: ${id}`)

  const pathSnapshot = await categoriesRef
    .orderByChild('path')
    .equalTo(data.path)
    .once('value')
  const nameSnapshot = await categoriesRef
    .orderByChild('name')
    .equalTo(data.name)
    .once('value')

  console.log('pathSnapshot', pathSnapshot.val())
  console.log('nameSnapshot', nameSnapshot.val())

  if (pathSnapshot.val() !== null && Object.keys(pathSnapshot.val()).indexOf(id) === -1) {
    req.flash('info', '已有相同路徑')
    res.redirect('/dashboard/categories')
  } else if (nameSnapshot.val() !== null && Object.keys(nameSnapshot.val()).indexOf(id) === -1) {
    req.flash('info', '已有相同分類名稱')
    res.redirect('/dashboard/categories')
  } else {
    categoriesRef
      .child(id)
      .update(data)
      .then(function () {
        req.flash('info', '更新路徑成功')
        res.redirect(`/dashboard/categories`)
      })
  }
})

router.post('/categories/delete/:id', function (req, res) {
  // const id = req.param('id')
  const id = req.params.id
  console.log('id', id)
  categoriesRef.child(id).remove()
  req.flash('info', '欄位已刪除')
  res.redirect('/dashboard/categories')
})


// users (待處理)
router.get('/users', async function (req, res, next) {
  const messages = req.flash('info')
  console.log('messages', messages)

  categoriesRef.once('value').then(function (snapshot) {
    const categories = snapshot.val()
    // console.log('categories', categories)
    res.render('dashboard/users', {
      title: 'Express',
      messages,
      hasInfo: messages?.length > 0,
      categories,
    })
  })
})

router.post('/users/create', async function (req, res) {
  const data = req.body
  // console.log('categories create data', data)

  const categoryRef = categoriesRef.push()
  const key = categoryRef.key
  data.id = key

  const pathSnapshot = await categoriesRef
    .orderByChild('path')
    .equalTo(data.path)
    .once('value')
  const nameSnapshot = await categoriesRef
    .orderByChild('name')
    .equalTo(data.name)
    .once('value')

  if (pathSnapshot.val() !== null) {
    req.flash('info', '已有相同路徑')
    res.redirect('/dashboard/categories')
  } else if (nameSnapshot.val() !== null) {
    req.flash('info', '已有相同分類名稱')
    res.redirect('/dashboard/categories')
  } else {
    categoryRef.set(data).then(function () {
      req.flash('info', '新增路徑成功')
      res.redirect('/dashboard/categories')
    })
  }
})

router.post('/uesrs/update/:id', async function (req, res) {
  const data = req.body
  const id = req.params.id
  const role = data.role
  const name = data.name
  console.log(`path: ${path}, name: ${name}, id: ${id}`)

  const pathSnapshot = await categoriesRef
    .orderByChild('role')
    .equalTo(data.role)
    .once('value')
  const nameSnapshot = await categoriesRef
    .orderByChild('name')
    .equalTo(data.name)
    .once('value')

  console.log('roleSnapshot', roleSnapshot.val())
  console.log('nameSnapshot', nameSnapshot.val())

  if (nameSnapshot.val() !== null && Object.keys(nameSnapshot.val()).indexOf(id) === -1) {
    req.flash('info', '已有相同名稱')
    res.redirect('/dashboard/users')
  } else {
    usersRef
      .child(id)
      .update(data)
      .then(function () {
        req.flash('info', '更新用戶資訊成功')
        res.redirect(`/dashboard/users`)
      })
  }
})

router.post('/users/delete/:id', function (req, res) {
  // const id = req.param('id')
  const id = req.params.id
  console.log('id', id)
  usersRef.child(id).remove()
  req.flash('info', '欄位已刪除')
  res.redirect('/dashboard/users')
})

// roles
router.get('/roles', function (req, res, next) {
  const messages = req.flash('info')
  console.log('messages', messages)

  rolesRef.once('value').then(function (snapshot) {
    const roles = snapshot.val()
    console.log('roles', roles)
    // console.log('categories', categories)
    return res.render('dashboard/roles', {
      title: 'Express',
      messages,
      hasInfo: messages?.length > 0,
      roles,
    })
  })
})

router.post('/roles/create', async function (req, res) {
  const data = req.body
  // console.log('categories create data', data)

  const roleRef = rolesRef.push()
  const key = roleRef.key
  data.id = key

  const nameSnapshot = await rolesRef
    .orderByChild('name')
    .equalTo(data.name)
    .once('value')

  if (nameSnapshot.val() !== null) {
    req.flash('info', '已有相同角色名稱')
    res.redirect('/dashboard/roles')
  } else {
    roleRef.set(data).then(function () {
      req.flash('info', '新增角色成功')
      res.redirect('/dashboard/roles')
    })
  }
})

router.post('/roles/update/:id', async function (req, res) {
  const data = req.body
  const id = req.params.id
  const name = data.name
  const note = data.note
  console.log(`note: ${note}, name: ${name}, id: ${id}`)

  const nameSnapshot = await rolesRef
    .orderByChild('name')
    .equalTo(data.name)
    .once('value')

  console.log('nameSnapshot', nameSnapshot.val())

  if (nameSnapshot.val() !== null && Object.keys(nameSnapshot.val()).indexOf(id) === -1) {
    req.flash('info', '已有相同角色名稱')
    res.redirect('/dashboard/roles')
  } else {
    rolesRef
      .child(id)
      .update(data)
      .then(function () {
        req.flash('info', '更新角色資訊成功')
        res.redirect(`/dashboard/roles`)
      })
  }
})

router.post('/roles/delete/:id', function (req, res) {
  // const id = req.param('id')
  const id = req.params.id
  console.log('id', id)
  rolesRef.child(id).remove()
  req.flash('info', '資料已刪除')
  res.redirect('/dashboard/roles')
})

module.exports = router
