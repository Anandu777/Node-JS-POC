const bcrypt = require('bcryptjs')
const { UNAUTHORIZED } = require('../../../utils/statusCodes')
const ErrorHandler = require('../../../utils/ErrorHandler')

module.exports = async (password, user, msg) => {
   const isMatch = await bcrypt.compare(password, user.password)
   if (!isMatch) {
      throw new ErrorHandler({ errors: [{ msg }] }, UNAUTHORIZED)
   }
}
