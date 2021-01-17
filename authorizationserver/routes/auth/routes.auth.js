const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

const registerHandler = require('./handlers/registerHandler')
const getTokenHandler = require('./handlers/getTokenHandler')
const getEmailHandler = require('./handlers/getEmailHandler')

// Register user
router.post(
   '/register',
   [
      check('email', 'Email is required!').not().isEmpty(),
      check('password', 'Password is required!').not().isEmpty(),
   ],
   registerHandler
)

// Give token
router.post(
   '/token',
   [
      check('email', 'Email is required!').not().isEmpty(),
      check('password', 'Password is required!').not().isEmpty(),
   ],
   getTokenHandler
)

// Give email
router.post(
   '/email',
   [check('token', 'Token is required!').not().isEmpty()],
   getEmailHandler
)

module.exports = router
