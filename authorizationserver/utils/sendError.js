const sendResponse = require('./sendResponse')
const { INTERNAL_SERVER_ERROR } = require('./statusCodes')

module.exports = (res, error) => {
   let statusCode = error.statusCode || INTERNAL_SERVER_ERROR
   sendResponse(res, statusCode, error.message)
}
