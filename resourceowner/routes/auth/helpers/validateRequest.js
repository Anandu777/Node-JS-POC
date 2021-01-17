const { validationResult } = require('express-validator')
const { BAD_REQUEST } = require('../../../utils/statusCodes')
const ErrorHandler = require('../../../utils/ErrorHandler')

module.exports = (req) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      throw new ErrorHandler({ errors: errors.array() }, BAD_REQUEST)
   }
}
