const firebaseAdmin = require('firebase-admin')
require('dotenv').config()
// const serviceAccount = require('../hexblog-e608b-firebase-adminsdk-drijj-c97844f9f8.json')
// var serviceAccount = require("path/to/serviceAccountKey.json");

firebaseAdmin.initializeApp({
  // credential: firebaseAdmin.credential.cert(serviceAccount),
  credential: firebaseAdmin.credential.cert({
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
})

const db = firebaseAdmin.database()
module.exports = db