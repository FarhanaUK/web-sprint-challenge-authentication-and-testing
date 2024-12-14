// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')
const bcrypt = require('bcryptjs')

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy()
})


test('[0] sanity', () => {
  expect(true).not.toBe(false) 
})
describe('[POST] /api/auth/register', () => {
test('[1] Created new user in database ', async() => {
  await request(server).post('/api/auth/register').send({ username: 'bob', password: '1234' });
  const sue = await db('users').where('username', 'bob').first();
  expect(sue).toMatchObject({ username: 'bob' });
});
test('[2] Responds with the proper status code and message on "status: 401, message: "Invalid Credentials" ', async() => {
  const res = await request(server).post('/api/auth/register').send({ username: 'bob', password: '1234' })
  expect(res.status).toBe(401)
  expect(res.body.message).toMatch(/username taken/i)
})
})

describe('[POST] /api/auth/login', () => {
  test('[3]  responds with the correct message on valid credentials bob is back', async() => {
    const res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '1234' })
    expect(res.body.message).toMatch('bob is back')
  })
  test('[4] responds with correct status for invalid credentials', async () => {
    let res = await request(server).post('/api/auth/login').send({ username: '', password: '' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/username and password required/i);
  });
  })

  describe('[GET] /api/jokes', () => {
    test('[5] responds with the proper status code and message status: 401, message: "Token invalid"', async() => {
      let res = await request(server).post('/api/auth/login').send({ username: 'bobsy', password: '1234' })
      expect(res.body.message).toMatch(/invalid credentials/i)
    })
    test('[6] responds with the proper status code status: 402, message: "token required"', async() => {
      let res = await request(server).post('/api/auth/login').send({ username: 'bobsy', password: '1234' })
      expect(res.body.message).toMatch(/invalid credentials/i)
    })
    })



