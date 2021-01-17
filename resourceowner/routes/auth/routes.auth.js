const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

const registerHandler = require('./handlers/registerHandler')
const loginHandler = require('./handlers/loginHandler')

//Register user
router.post(
   '/register',
   [
      check('email', 'Email is required!').not().isEmpty(),
      check('password', 'Password is required!').not().isEmpty(),
   ],
   registerHandler
)

// Login after getting authorization from authorizaton server
router.post(
   '/login',
   [check('email', 'Email is required!').not().isEmpty()],
   loginHandler
)

module.exports = router
