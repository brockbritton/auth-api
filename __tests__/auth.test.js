'use strict';

const { app } = require('../src/server.js');
const { db, food, clothes } = require('../models');
const supertest = require('supertest');

const request = supertest(app);

beforeAll( async() => {
  await db.sync();
});

describe('Auth routes', () => {
  it('Should ')
});
