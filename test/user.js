import request from 'supertest'
import app from '../server.js'
import { faker } from '@faker-js/faker';
import { expect } from 'chai'

describe('POST /api/v1/user/login', () => {
    it('responds with success for valid login', async () => {
        const email = 'mailtomohit2002@gmail.com';
        const password = 'Mohit1983*';

        const response = await request(app)
            .post('/api/v1/user/login')
            .send({ email, password })
            .expect(200)
            .expect('Content-Type', /json/);

        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('token'); // Assuming token property exists
    });

    it('responds with error on invalid credentials', async () => {
        const email = 'mailtomohit2002@gmail.com';
        const password = 'Mohit';

        const response = await request(app)
            .post('/api/v1/user/login')
            .send({ email, password })
            .expect(404)
    });


});

describe('POST /api/v1/user/register', () => {
    it('should register a new user', async () => {
        const newUser = {
            name: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        };

        const res = await request(app)
            .post('/api/v1/user/register')
            .send(newUser);

        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.data).to.include('Email Sent with URL');
    });

    it('shows error when credentials are missing', async () => {
        const newUser = {
            name: faker.internet.userName(),
            email: faker.internet.email(),
        };

        const res = await request(app)
            .post('/api/v1/user/register')
            .send(newUser);

        expect(res.status).to.equal(400);
    });
});
