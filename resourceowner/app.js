const express = require('express')
const app = express()
const mongoose = require('mongoose')
const MONGOURI = process.env.MONGOURI

mongoose.connect(MONGOURI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true,
   useFindAndModify: false,
})

mongoose.connection.on('connected', () => {
   console.log('MongoDB connected!')
})

mongoose.connection.on('error', (err) => {
   console.log(`Connection error ${err}`)
})

app.use(express.json())
app.use(require('./routes/auth'))

module.exports = app
