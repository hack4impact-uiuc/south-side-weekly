const app = require('../dist/app');
const mongoose = require('mongoose');
const request = require('supertest');
const { response } = require('express');

afterAll(async () => {
    await mongoose.connection.close();
});


describe('GET /api/users/', () => {
    test('API should return users text', async () => {
        const response = await request(app).get('/api/users');
        expect(response.body.message).toEqual(
            'Successfully retrieved all users.',
        );
        expect(response.statusCode).toBe(200);
    });
});

describe('GET /api/users/6024ba0172539ce34973edfb', () => {
    test('API should return Development User', async () => {
        const response = await request(app).get('/api/users/6024ba0172539ce34973edfb');
        expect(response.body.message).toEqual(
            'Successfully retrieved user with id 6024ba0172539ce34973edfb',
        );
        expect(response.statusCode).toBe(200);
    });
});

describe('GET /api/users/6024ba0172539ce34973edfc', () => {
    test('API should return 404 for no user with that id', async () => {
        const response = await request(app).get('/api/users/6024ba0172539ce34973edfc');
        expect(response.body.message).toEqual(
            'User not found with id',
        );
        expect(response.statusCode).toBe(404);
    });
});

describe('GET /api/users/BAD_ID', () => {
    test('API should return 400 for bad ID format', async () => {
        const response = await request(app).get('/api/users/BAD_ID');
        expect(response.body.message).toEqual(
            'Bad ID format',
        );
        expect(response.statusCode).toBe(400);
    });
});