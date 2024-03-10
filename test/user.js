import request from 'supertest'
import app from '../server.js'
import { faker } from '@faker-js/faker';
import { expect } from 'chai'

// describe('POST /api/v1/user/login', () => {
//     it('responds with success for valid login', async () => {
//         const email = 'mailtomohit2002@gmail.com';
//         const password = 'Mohit1983*';

//         const response = await request(app)
//             .post('/api/v1/user/login')
//             .send({ email, password })
//             .expect(200)
//             .expect('Content-Type', /json/);

//         expect(response.body).to.have.property('success', true);
//         expect(response.body).to.have.property('token'); // Assuming token property exists
//     });

//     it('responds with error on invalid credentials', async () => {
//         const email = 'mailtomohit2002@gmail.com';
//         const password = 'Mohit';

//         const response = await request(app)
//             .post('/api/v1/user/login')
//             .send({ email, password })
//             .expect(404)
//     });


// });

// describe('POST /api/v1/user/register', () => {
//     it('should register a new user', async () => {
//         const newUser = {
//             name: faker.internet.userName(),
//             email: faker.internet.email(),
//             password: faker.internet.password()
//         };

//         const res = await request(app)
//             .post('/api/v1/user/register')
//             .send(newUser);

//         expect(res.status).to.equal(200);
//         expect(res.body.success).to.equal(true);
//         expect(res.body.data).to.include('Email Sent with URL');
//     });

//     it('shows error when credentials are missing', async () => {
//         const newUser = {
//             name: faker.internet.userName(),
//             email: faker.internet.email(),
//         };

//         const res = await request(app)
//             .post('/api/v1/user/register')
//             .send(newUser);

//         expect(res.status).to.equal(400);
//     });
// });

/* logout testing */
// describe('GET /api/v1/user/logout', () => {
//     it('should logout a user', async () => {
//         const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZWI5OTE3ZWNmYTdmM2RkZjg3OTBjYyIsInBhc3N3b3JkIjoiJDJiJDEwJG1ERzNxaklnZFF6OFZKOHU2LzA0Qy5Ic1NaU3VVeDhRWFoyamh6djcwNkdhNHgyY0NYVUZhIiwiaWF0IjoxNzA5OTQzMDEwfQ.pjsUSoOZ4TJBMgx-9dXjZvom6NOmO95D8c8WFTS1X8';

//         const res = await request(app)
//             .get('/api/v1/user/logout')
//             .set('Authorization', `Bearer ${token}`);

//         expect(res.status).to.equal(200);
//         expect(res.body.status).to.equal('success');
//     });
// });