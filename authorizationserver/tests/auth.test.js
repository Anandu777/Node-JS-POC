const request = require('supertest')
const app = require('../app')
const User = require('../models/user')
const { setupDatabase } = require('./db')

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

test('Should provide token to existing user', async () => {
   const email = 'user1@example.com'
   const password = '123456'
   await request(app)
      .post('/token')
      .send({
         email,
         password,
      })
      .expect(200)
})

test('Should not provide token to non nexisting user', async () => {
   await request(app)
      .post('/token')
      .send({
         email: 'user4@example.com',
         password: '123456',
      })
      .expect(401)

   await request(app)
      .post('/token')
      .send({
         email: 'user1@example.com',
         password: 'ajkdnakd',
      })
      .expect(401)
})

test('Should not provide email when invalid token is provided', async () => {
   await request(app).post('/email').send({ token: 'adbakdnaknda' }).expect(401)
})
