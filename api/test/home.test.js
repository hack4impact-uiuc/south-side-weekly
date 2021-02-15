const app = require('../dist/app');
const mongoose = require('mongoose');
const request = require('supertest');

afterAll(async () => {
  await mongoose.connection.close();
});

describe('GET / ', () => {
  test('API should return working message', async () => {
    const response = await request(app).get('/');
    expect(response.body).toEqual('API working!');
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /api/users/ ', () => {
  test('API should return users text', async () => {
    const response = await request(app).get('/api/users');
    expect(response.body.message).toEqual(
      'Successfully retrieved Development users.',
    );
    expect(response.statusCode).toBe(200);
  });
});
