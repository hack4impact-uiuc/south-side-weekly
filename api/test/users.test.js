const app = require('../dist/app');
const mongoose = require('mongoose');
const request = require('supertest');

afterAll(async () => {
    await mongoose.connection.close();
});

const UNKNOWN_MONGOID = '60332bee8945e5ee037bfdf1';


describe('GET all users', () => {
    test('API should return users text', async () => {
        const response = await request(app).get('/api/users');
        expect(response.body.message).toEqual('Successfully retrieved all users.');
        expect(response.statusCode).toBe(200);
    });
});

describe('GET single user', () => {
    test('API should return Development User', async () => {
        const response = await request(app).get('/api/users/60332ef8dd742493ce5562b3');
        expect(response.body.message).toEqual('Successfully retrieved user');
        expect(response.statusCode).toBe(200);
    });
});

describe('GET unknown user', () => {
    test('API should return 404 for no user with that id', async () => {
        const response = await request(app).get(`/api/users/${UNKNOWN_MONGOID}`);
        expect(response.body.message).toEqual('User not found with id');
        expect(response.statusCode).toBe(404);
    });
});

describe('GET user by invalid ID', () => {
    test('API should return 400 for bad ID format', async () => {
        const response = await request(app).get('/api/users/BAD_ID');
        expect(response.body.message).toEqual('Bad ID format');
        expect(response.statusCode).toBe(400);
    });
});

describe('POST create a new user', () => {
    test('API should create a new user', async () => {
        const response = await request(app).post('/api/users/').send({
            firstName: 'Test',
            lastName: 'User',
            email: 'testUser@gmail.com',
        });

        expect(response.body.message).toEqual('Successfully created new user')
        expect(response.statusCode).toBe(200);

        // clear test user that was created
        const deleteResponse = await request(app).delete(`/api/users/${response.body.result._id}`);

        expect(deleteResponse.body.message).toEqual('User successfully deleted');
        expect(deleteResponse.statusCode).toBe(200);
    });
});

describe('PUT update a specific user', () => {
    test('API should update Development user', async () => {
        const response = await request(app).put('/api/users/60332ef8dd742493ce5562b3').send({
            firstName: 'Development',
        });

        expect(response.body.message).toEqual('Successfully updated user');
        expect(response.statusCode).toBe(200);
    });
});

describe('PUT update invalid mongoID user', () => {
    test('API should recognize bad MongoID', async () => {
        const response = await request(app).put('/api/users/BAD_ID').send({
            firstName: 'Development'
        });

        expect(response.body.message).toEqual('Bad ID format');
        expect(response.statusCode).toBe(400);
    });
});

describe('PUT update unknown user', () => {
    test('API should not find user', async () => {
        const response = await request(app).put(`/api/users/${UNKNOWN_MONGOID}`).send({
            firstName: 'Development'
        });

        expect(response.body.message).toEqual('User not found with id');
        expect(response.statusCode).toBe(404);
    });
});

describe('DELETE a specific user', () => {
    test('API should delete a user', async () => {

        // create a test user to delete
        const createdUserResponse = await request(app).post('/api/users/').send({
            firstName: 'Delete',
            lastName: 'User',
            email: 'deleteUser@gmail.com',
        });

        expect(createdUserResponse.body.message).toEqual('Successfully created new user')
        expect(createdUserResponse.statusCode).toBe(200);

        const deleteResponse = await request(app).delete(`/api/users/${createdUserResponse.body.result._id}`);

        expect(deleteResponse.body.message).toEqual('User successfully deleted');
        expect(deleteResponse.statusCode).toBe(200);
    })
});

describe('DELETE an unknown user id', () => {
    test('API should return a 404 for a user not being found', async () => {
        const deleteResponse = await request(app).delete(`/api/users/${UNKNOWN_MONGOID}`);

        expect(deleteResponse.body.message).toEqual('User not found with id');
        expect(deleteResponse.statusCode).toBe(404);
    });
});

describe('DELETE an bad MongoID', () => {
    test('API should return a 400 for bad user ID', async () => {
        const deleteResponse = await request(app).delete(`/api/users/BAD_ID`);

        expect(deleteResponse.body.message).toEqual('Bad ID format');
        expect(deleteResponse.statusCode).toBe(400);
    });
});