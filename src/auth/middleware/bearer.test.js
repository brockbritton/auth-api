
const bearer = require('./bearer');
const { db, users } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let user;

beforeAll( async () => {
  await db.sync();
  user = await users.create({
    username: 'user',
    password: 'pass',
  });
});

afterAll( async () => {
  db.drop();
});

describe('Bearer Middleware Test', () => {
  it('Should authenticate token and next should be called', async () => {
    let token = jwt.sign(user.username, process.env.SECRET)
    let req = {
      headers: {authorization: `Bearer ${token}`}
    };
    let res = null;
    let next = jest.fn();
    await bearer(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});