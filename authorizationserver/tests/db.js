const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const userOneId = new mongoose.Types.ObjectId()

const userOne = {
   _id: userOneId,
   email: 'user1@example.com',
   password: '123456',
   token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
}

const setupDatabase = async () => {
   await User.deleteMany()

   const salt = await bcrypt.genSalt(10)
   const password = await bcrypt.hash(userOne.password, salt)
   userOne.password = password

   await new User(userOne).save()
}

module.exports = {
   userOneId,
   userOne,
   setupDatabase,
}
