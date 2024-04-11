'use strict';

require('dotenv').config();
const { server } = require('../src/server.js');
const { sequelize, food, clothes } = require('../src/models');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const { db, users } = require('../src/auth/models/index.js');

const request = supertest(server);

let foodItem;
let foodItem2;
let clothesItem;
let user;

beforeAll(async () => {
  await db.sync();
  await sequelize.sync();
  foodItem = await food.create({
    name: 'apple',
    calories: 100,
    type: 'fruit',
  });
  foodItem2 = await food.create({
    name: 'eggplant',
    calories: 500,
    type: 'fruit',
  });
  clothesItem = await clothes.create({
    name: 'shirt',
    color: 'blue',
    size: 'medium',
  });
  user = await users.create({
    username: 'testA',
    password: 'testA',
    role: 'admin',
  });
});

afterAll(async () => {
  await db.drop();
  await sequelize.drop();
});

describe('Food and Clothes V1-routes', () => {
  it('Should create a new food item on POST /food', async () => {
    const response = await request
      .post('/api/v1/food')
      .send({ name: 'banana', calories: 150, type: 'fruit' });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('banana');
  });
  it('should get a list of food items on GET /food', async () => {
    const response = await request.get('/api/v1/food');
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });
  it('should get a food item on GET /food/:id', async () => {
    const response = await request.get(`/api/v1/food/${foodItem.id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('apple');
  });
  it('should update a food item on PUT /food/:id', async () => {
    const response = await request
      .put(`/api/v1/food/${foodItem.id}`)
      .send({ name: 'orange', calories: 200, type: 'fruit' });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('orange');
  });
  it('should delete a food item on DELETE /food/:id', async () => {
    const response = await request.delete(`/api/v1/food/${foodItem.id}`);
    expect(response.status).toBe(200);
  });
});

describe('Food and Clothes V2-routes', () => {
  it('Should create a new food item on POST /food', async () => {
    let token = jwt.sign({ username: user.username }, process.env.SECRET);
    const response = await request
      .post('/api/v2/food')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'banana', calories: 150, type: 'fruit' });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('banana');
  });
  it('should get a list of food items on GET /food', async () => {
    let token = jwt.sign({ username: user.username }, process.env.SECRET);
    const response = await request
      .get('/api/v2/food')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });
  it('should get a food item on GET /food/:id', async () => {
    let token = jwt.sign({ username: user.username }, process.env.SECRET);
    const response = await request
      .get(`/api/v2/food/${foodItem2.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('eggplant');
  });
  it('should update a food item on PUT /food/:id', async () => {
    let token = jwt.sign({ username: user.username }, process.env.SECRET);
    const response = await request
      .put(`/api/v2/food/${foodItem2.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'grape', calories: 200, type: 'fruit' });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('grape');
  });
  it('should delete a food item on DELETE /food/:id', async () => {
    let token = jwt.sign({ username: user.username }, process.env.SECRET);
    const response = await request
      .delete(`/api/v2/food/${foodItem.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
});