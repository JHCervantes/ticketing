import request from 'supertest';
import { app } from '../../app';

it('should fail when an emil that does not exist is supplied', async () => {
    await request(app)
        .post('/api/users/sign-in')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400)
});

it('should fail when an incorrect password is supplied', async () => {
    await request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    await request(app)
        .post('/api/users/sign-in')
        .send({
            email: 'test@test.com',
            password: 'dfas'
        })
        .expect(400)
});

it('should return a 400 with an invalid email', async () => {
    await request(app)
        .post('/api/users/sign-in')
        .send({
            email: 'testtest.com',
            password: 'password'
        })
        .expect(400)
});

it('should return a 400 with missing email or password', async () => {
    await request(app)
        .post('/api/users/sign-in')
        .send({
            email: 'test@test.com'
        })
        .expect(400)

    await request(app)
        .post('/api/users/sign-in')
        .send({
            password: 'password'
        })
        .expect(400)
});

it('should respond with a a cookie after successful sign in', async () => {
    await request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    const response = await request(app)
        .post('/api/users/sign-in')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined();
});
