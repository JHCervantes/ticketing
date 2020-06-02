import request from 'supertest';
import { app } from '../../app';

it('should return a 201 on successful sign up', async () => {
    await request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
});

it('should return a 400 with an invalid email', async () => {
    await request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'testtest.com',
            password: 'password'
        })
        .expect(400)
});

it('should return a 400 with an invalid password', async () => {
    await request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'test@test.com',
            password: 'p'
        })
        .expect(400)
});

it('should return a 400 with missing email or password', async () => {
    await request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'test@test.com'
        })
        .expect(400)

    await request(app)
        .post('/api/users/sign-up')
        .send({
            password: 'password'
        })
        .expect(400)
});

it('should disallow duplicate emails', async () => {
    await request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    await request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400)
});

it('should set a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined();
});
