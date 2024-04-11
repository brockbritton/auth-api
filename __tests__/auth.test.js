'use strict';

const { server } = require('../src/server.js');
const { db, users } = require('../src/auth/models');
const supertest = require('supertest');
const jwt = require('jsonwebtoken')

const request = supertest(server);
let user;
beforeAll(async () => {
  await db.sync();
  user = await users.create({
    username: 'testA',
    password: 'testA',
    role: 'admin',
  });
});

afterAll(async () => {
  await db.drop();
});

describe('Auth routes', () => {
  it('Should create a new user', async () => {
    const response = await request.post('/auth/signup').send({ username: 'user', password: 'password', role: 'admin' });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.username).toEqual('user');
  });

  it('should sign in with basic auth', async () => {
    const response = await request.post('/auth/signin').auth('user', 'password');
    expect(response.status).toBe(200);
    expect(response.body.user.username).toBe('user');
    expect(response.body.token).toBeTruthy();
  });

  it('should get a list of users on GET /users', async () => {
    let token = jwt.sign({ username: user.username }, process.env.SECRET);
    console.log('user:', user.username, 'token:', token);
    const response = await request
      .get('/auth/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });

  it('should get a secret on GET /secret', async () => {
    let token = jwt.sign({ username: user.username }, process.env.SECRET);
    const response = await request
      .get('/auth/secret')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe('Welcome to the secret area');
  });
});
