const sendError = require('../../../utils/sendError')
const { UNAUTHORIZED } = require('../../../utils/statusCodes')
const ErrorHandler = require('../../../utils/ErrorHandler')
const validateRequest = require('../helpers/validateRequest')
const comparePassword = require('../helpers/comparePasswords')
const generateToken = require('../helpers/generateToken')
const User = require('../../../models/user')

module.exports = async (req, res) => {
   try {
      validateRequest(req)
      const { email, password } = req.body

      // See if user exists
      let user = await User.findOne({ email: email.toLowerCase() })

      if (!user) {
         throw new ErrorHandler(
            { errors: [{ msg: 'Authorization denied!' }] },
            UNAUTHORIZED
         )
      }

      // Compare passwords
      await comparePassword(password, user, 'Authorization denied!')

      // Generate token
      await generateToken(res, user)
   } catch (err) {
      sendError(res, err)
   }
}
