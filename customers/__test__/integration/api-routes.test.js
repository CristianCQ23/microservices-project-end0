process.env.APP_SECRET = 'test-secret';

const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../src/services/customer-service', () => jest.fn().mockImplementation(() => ({
    SignUp: jest.fn().mockResolvedValue({ data: { id: 'customer-1', token: 'token' } }),
    SignIn: jest.fn(),
    GetProfile: jest.fn(),
    GetWishlist: jest.fn(),
    AddToWishlist: jest.fn().mockResolvedValue({ data: [] }),
    GetCart: jest.fn().mockResolvedValue({ data: [] }),
    AddToCart: jest.fn().mockResolvedValue({ data: [] }),
    RemoveFromCart: jest.fn().mockResolvedValue({ data: [] }),
})));

const customerRoutes = require('../../src/api/customer');
const HandleErrors = require('../../src/utils/error-handler');

const createApp = () => {
    const app = express();
    app.use(express.json());
    app.use('/customers', customerRoutes);
    app.use(HandleErrors);
    return app;
};

describe('customers HTTP routes', () => {
    test('creates a user', async () => {
        const response = await request(createApp())
            .post('/customers/signup')
            .send({ email: 'test@example.com', password: 'secret123', phone: '2332' });

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe('customer-1');
    });

    test('requires authentication for the cart', async () => {
        const response = await request(createApp()).get('/customers/cart');
        expect(response.statusCode).toBe(401);
    });

    test('returns the authenticated customer cart', async () => {
        const token = jwt.sign({ _id: 'customer-1' }, process.env.APP_SECRET);
        const response = await request(createApp())
            .get('/customers/cart')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });
});
