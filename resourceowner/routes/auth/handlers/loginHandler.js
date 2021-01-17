const sendResponse = require('../../../utils/sendResponse')
const sendError = require('../../../utils/sendError')
const { SUCCESS, UNAUTHORIZED } = require('../../../utils/statusCodes')
const ErrorHandler = require('../../../utils/ErrorHandler')
const validateRequest = require('../helpers/validateRequest')
const User = require('../../../models/user')

module.exports = async (req, res) => {
   try {
      validateRequest(req)
      const { email } = req.body

      // See if user exists
      let user = await User.findOne({ email: email.toLowerCase() })

      if (!user) {
         throw new ErrorHandler(
            { errors: [{ msg: 'Login Failed!' }] },
            UNAUTHORIZED
         )
      }

      sendResponse(res, SUCCESS, 'Login success!')
   } catch (err) {
      sendError(res, err)
   }
}
