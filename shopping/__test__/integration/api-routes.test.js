process.env.APP_SECRET = 'test-secret';

const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../src/services/shopping-service', () => jest.fn().mockImplementation(() => ({
    PlaceOrder: jest.fn().mockResolvedValue({ data: { _id: 'order-1', status: 'received' } }),
})));

const shoppingRoutes = require('../../src/api/shopping');
const HandleErrors = require('../../src/utils/error-handler');

const createApp = () => {
    const app = express();
    app.use(express.json());
    app.use('/shopping', shoppingRoutes);
    app.use(HandleErrors);
    return app;
};

describe('shopping HTTP routes', () => {
    test('requires a token to create an order', async () => {
        const response = await request(createApp())
            .post('/shopping/order')
            .send({ txnId: 'txn-1' });

        expect(response.statusCode).toBe(401);
    });

    test('creates an authenticated order', async () => {
        const token = jwt.sign({ _id: 'customer-1' }, process.env.APP_SECRET);
        const response = await request(createApp())
            .post('/shopping/order')
            .set('Authorization', `Bearer ${token}`)
            .send({ txnId: 'txn-1' });

        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe('order-1');
    });
});
