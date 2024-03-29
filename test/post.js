import request from 'supertest'
import app from '../server.js'
import { faker } from '@faker-js/faker';
import { expect } from 'chai'

/* for creating a new post */

describe('POST /api/v1/post/', () => {
    it('should create a new post', async () => {

        /* obtain this token from login */
        const token = 'JWT_TOKEN_VIA_LOGIN';

        const newPost = {
            postString: faker.string.sample()
        };

        const res = await request(app)
            .post('/api/v1/post/')
            .send(newPost)
            .set('Authorization', `Bearer ${token}`);


        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal(true);
    });
    
});


/* for getting posts of my followers and the users which i follow */
describe('GET /api/v1/post/', () => {
    /* obtain this token from login */
    const token = 'JWT_TOKEN_VIA_LOGIN';

    it('should get posts from followed users', async () => {
        const res = await request(app)
            .get('/api/v1/post/')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body).to.have.property('data');
    });
});

/* to delete a post */

describe('DELETE /api/v1/post/:id', () => {
    it('should delete a post', async () => {
        const token = 'JWT_TOKEN_VIA_LOGIN';

        const postId = '65edd316df9be06548a19e0e'; // Replace with your post id

        const res = await request(app)
            .delete(`/api/v1/post/${postId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.data).to.include(postId);
    });
});

/* UPDATE A POST CONTENT */
describe('PUT /api/v1/post/:id', () => {
    it('should update a post', async () => {
        const token = 'JWT_TOKEN_VIA_LOGIN';

        const postId = '65edd19900a9bc17209b800f'; // Replace with your post 

        const updatedPost = {
            postString: faker.string.sample()
        };

        const res = await request(app)
            .put(`/api/v1/post/${postId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedPost);

        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal(true);
    });
});