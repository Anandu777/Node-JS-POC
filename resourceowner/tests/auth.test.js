const request = require('supertest')
const app = require('../app')
const User = require('../models/user')
const { userOne, setupDatabase } = require('./db')

beforeAll(setupDatabase)

test('Should register a new user', async () => {
   const res = await request(app)
      .post('/register')
      .send({
         email: 'user2@example.com',
         password: '123456',
      })
      .expect(200)

   const user = await User.findById(res.body._id)
   expect(user).not.toBeNull()

   expect(res.body).toMatchObject({
      email: 'user2@example.com',
   })
})

test('Should not register a new user', async () => {
   const res = await request(app)
      .post('/register')
      .send({
         email: 'user3@example.com',
         password: '',
      })
      .expect(400)

   let user = await User.findById(res.body._id)
   expect(user).toBeNull()

   await request(app)
      .post('/register')
      .send({
         email: '',
         password: '123456',
      })
      .expect(400)

   user = await User.findById(res.body._id)
   expect(user).toBeNull()

   await request(app)
      .post('/register')
      .send({
         email: '',
         password: '',
      })
      .expect(400)

   user = await User.findById(res.body._id)
   expect(user).toBeNull()
})

test('Should login authorized user', async () => {
   await request(app).post('/login').send({ email: userOne.email }).expect(200)
})

test('Should not login unauthorized user', async () => {
   await request(app)
      .post('/login')
      .send({ email: 'user3@example.com' })
      .expect(401)
})
