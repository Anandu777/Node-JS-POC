const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const JWT_SECRET = process.env.JWT_SECRET

// Register user
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

// Give token
router.post(
   '/token',
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
         const { email, password } = req.body

         // See if user exists
         let user = await User.findOne({ email: email.toLowerCase() })

         if (!user) {
            return res
               .status(401)
               .json({ errors: [{ msg: 'Authorization denied!' }] })
         }

         // Compare passwords
         const isMatch = await bcrypt.compare(password, user.password)

         if (!isMatch) {
            return res
               .status(401)
               .json({ errors: [{ msg: 'Authorization denied!' }] })
         }

         // Generate token
         jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: 3600 },
            async (err, token) => {
               if (err) {
                  throw err
               }
               user.token = token
               await user.save()
               res.json({ token })
            }
         )
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error!')
      }
   }
)

// Give email
router.post(
   '/email',
   [check('token', 'Token is required!').not().isEmpty()],
   async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }

      try {
         const { token } = req.body

         // See if token exists
         let user = await User.findOne({ token })

         if (!user) {
            return res
               .status(401)
               .json({ errors: [{ msg: 'Authorization denied!' }] })
         }

         user.token = undefined

         await user.save()

         res.json({ email: user.email })
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error!')
      }
   }
)

module.exports = router
