const sendResponse = require('../../../utils/sendResponse')
const sendError = require('../../../utils/sendError')
const { SUCCESS, UNAUTHORIZED } = require('../../../utils/statusCodes')
const ErrorHandler = require('../../../utils/ErrorHandler')
const validateRequest = require('../helpers/validateRequest')
const User = require('../../../models/user')

module.exports = async (req, res) => {
   try {
      validateRequest(req)
      const { token } = req.body

      // See if token exists
      let user = await User.findOne({ token })

      if (!user) {
         throw new ErrorHandler(
            { errors: [{ msg: 'Authorization denied!' }] },
            UNAUTHORIZED
         )
      }

      user.token = undefined

      await user.save()

      sendResponse(res, SUCCESS, { email: user.email })
   } catch (err) {
      sendError(res, err)
   }
}
