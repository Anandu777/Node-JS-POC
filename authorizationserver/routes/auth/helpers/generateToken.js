const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const sendResponse = require('../../../utils/sendResponse')
const { SUCCESS } = require('../../../utils/statusCodes')

module.exports = async (res, user) => {
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
         sendResponse(res, SUCCESS, {
            token,
         })
      }
   )
}
