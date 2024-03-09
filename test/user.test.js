import request from 'supertest'
import app from '../server'
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
});