const sendResponse = require('../../../utils/sendResponse')
const sendError = require('../../../utils/sendError')
const { BAD_REQUEST, SUCCESS } = require('../../../utils/statusCodes')
const ErrorHandler = require('../../../utils/ErrorHandler')
const encryptPassword = require('../helpers/encryptPassword')
const validateRequest = require('../helpers/validateRequest')
const User = require('../../../models/user')

module.exports = async (req, res) => {
   try {
      validateRequest(req)
      let { email, password } = req.body

      let user = await User.findOne({ email: email.toLowerCase() })
      if (user) {
         throw new ErrorHandler(
            { errors: [{ msg: 'User already exists!' }] },
            BAD_REQUEST
         )
      }

      // Encrypt password
      password = await encryptPassword(password)

      user = new User({
         email: email.toLowerCase(),
         password,
      })

      await user.save()

      sendResponse(res, SUCCESS, { _id: user._id, email: user.email })
   } catch (err) {
      sendError(res, err)
   }
}
