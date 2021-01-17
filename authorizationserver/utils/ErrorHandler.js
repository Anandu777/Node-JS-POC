const { UNPROCESSABLE_ENTITY } = require('./statusCodes')

class ErrorHandler extends Error {
   constructor(message, statusCode = UNPROCESSABLE_ENTITY) {
      super()
      this.statusCode = statusCode
      this.message = message
   }
}

module.exports = ErrorHandler
