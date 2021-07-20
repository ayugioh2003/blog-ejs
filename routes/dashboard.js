const express = require('express')
const router = express.Router()
const firebaseAdminDb = require('../connections/firebase_admin')

const categoriesRef = firebaseAdminDb.ref('categories')
// categoriesRef.once('value', (snapshot) => {
//   const categories = snapshot.val()
//   console.log(categories)
// })

router.get('/archives', function (req, res, next) {
  res.render('dashboard/archives', { title: 'Express' })
})

router.get('/article', function (req, res, next) {
  res.render('dashboard/article', { title: 'Express' })
})

// categories
// router.get('/categories', function (req, res, next) {
//   categoriesRef.once('value').then(function (snapshot) {
//     const categories = snapshot.val()
//     console.log('categories', categories)
//     res.render('dashboard/categories', { title: 'Express', categories })
//   })
// })
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

router.post('/categories/create', function (req, res) {
  const data = req.body
  console.log('categories create data', data)

  const categoryRef = categoriesRef.push()
  // console.log('categoryRef', categoryRef)

  const key = categoryRef.key
  data.id = key
  console.log('key', key)

  categoryRef.set(data).then(function () {
    res.redirect('/dashboard/categories')
  })
})



router.post('/categories/delete/:id', function (req, res) {
  // const id = req.param('id')
  const id = req.params.id
  console.log('id', id)
  categoriesRef.child(id).remove()
  req.flash('info', '欄位已刪除')
  res.redirect('/dashboard/categories')
})


module.exports = router
