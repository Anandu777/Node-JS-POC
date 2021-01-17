module.exports = (res, statusCode, data) => {
   if (typeof data === 'string') {
      data = {
         msg: data,
      }
   }
   res.status(statusCode).json(data)
}
