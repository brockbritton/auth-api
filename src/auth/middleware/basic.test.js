
const basic = require('./basic');
const base64 = require('base-64');
const { db, users } = require('../models');

beforeAll( async () => {
  await db.sync();
  await users.create({
    username: 'user',
    password: 'pass',
  });
});

afterAll( async () => {
  db.drop();
});

describe('Basic Middleware Test', () => {
  it('Should correctly encode and decode:', async () => {
    let req = {headers: {authorization: `Basic ${base64.encode('user:pass')}`}};
    let res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    let next = jest.fn();
    await basic(req, res, next);
    expect(next).toHaveBeenCalled();
    
  });
});