const express = require('express')
const router = express.Router()
const firebase = require('../connections/firebase_client')
const fireAuth = firebase.auth()

const firebaseAdminDb = require('../connections/firebase_admin').database()
const usersRef = firebaseAdminDb.ref('users')
// const categoriesRef = firebaseAdminDb.ref('categories')
// const articlesRef = firebaseAdminDb.ref('articles')

// signup
router.get('/signup', (req, res) => {
  const messages = req.flash('error')
  res.render('dashboard/signup', {
    messages,
    hasErrors: messages.length > 0,
  })
})
router.post('/signup', function (req, res) {
  console.log('req.body', req.body)
  var email = req.body.email
  var password = req.body.password
  var confirmPassword = req.body.confirm_password

  if (password !== confirmPassword) {
    req.flash('error', '兩個密碼輸入不符合')
    res.redirect('/auth/signup')
  } else {
    fireAuth
      .createUserWithEmailAndPassword(email, password)
      .then(function (userCredential) {
        // console.log('userCredential', userCredential)

        const userInfo = {
          email: userCredential.user.email,
          uid: userCredential.user.uid,
          role: '',
          display_name: userCredential.user.email.split('@')[0],
        }
        console.log('data', userInfo)

        usersRef.child(userCredential.user.uid).set(userInfo)   

        res.redirect('/auth/signin')
      })
      .catch(function (error) {
        var errorMessage = error.message
        req.flash('error', errorMessage)
        console.log('error', error)
        res.redirect('/auth/signup')
      })
  }
})

// signin
router.get('/signin', function (req, res, next) {
  const messages = req.flash('error')
  res.render('dashboard/signin', {
    messages,
    hasErrors: messages.length > 0,
  })
})
router.post('/signin', function (req, res) {
  console.log('req.body', req.body)
  var email = req.body.email
  var password = req.body.password
  console.log(email, password)

  fireAuth
    .signInWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      req.session.uid = userCredential.user.uid
      req.session.email = userCredential.user.email
      console.log('session.uid', req.session.uid)
      res.redirect('/dashboard/archives')
    })
    .catch(function (error) {
      var errorMessage = error.message
      req.flash('error', errorMessage)
      console.log('error', error)
      res.redirect('/auth/signin')
    })
})

// signout
router.get('/signout', (req, res) => {
  req.session.uid = ''
  req.session.email = ''
  res.redirect('/auth/signin')
})

// userInfo
// signout
router.get('/userInfo', (req, res) => {
  // const roleOption = {
  //   admin: '管理員',
  //   editor: '編輯員',
  //   guest: '訪客',
  // }

  let role = 'guest'
  if (req.session.uid === process.env.ADMIN_UID) {
    role = 'admin'
  }

  res.json({
    uid: req.session.uid,
    email: req.session.email,
    role,
  })
})

module.exports = router
