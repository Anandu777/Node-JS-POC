const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

//Register user
router.post(
   '/register',
   [
      check('email', 'Email is required!').not().isEmpty(),
      check('password', 'Password is required!').not().isEmpty(),
   ],
   async (req, res) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }

      try {
         let { email, password } = req.body

         let user = await User.findOne({ email: email.toLowerCase() })
         if (user) {
            return res
               .status(400)
               .json({ errors: [{ msg: 'User already exists' }] })
         }

         // Encrypt password
         const salt = await bcrypt.genSalt(10)
         password = await bcrypt.hash(password, salt)

         user = new User({
            email: email.toLowerCase(),
            password,
         })

         await user.save()

         res.json({ _id: user._id, email: user.email })
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error!')
      }
   }
)

// Login after getting authorization from authorizaton server
router.post(
   '/login',
   [check('email', 'Email is required!').not().isEmpty()],
   async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }

      try {
         const { email } = req.body

         // See if user exists
         let user = await User.findOne({ email: email.toLowerCase() })

         if (!user) {
            return res.status(401).json({ errors: [{ msg: 'Login Failed!' }] })
         }

         res.json({ msg: 'Login success!' })
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error!')
      }
   }
)

module.exports = router
