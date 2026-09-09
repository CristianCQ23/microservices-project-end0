const express = require('express');
const request = require('supertest');

jest.mock('../../src/services/products-service', () => jest.fn().mockImplementation(() => ({
    GetProducts: jest.fn().mockResolvedValue({ data: {
        products: [{ _id: 'product-1', name: 'Sedan Ejecutivo', type: 'Sedan' }],
        categories: ['Sedan'],
    } }),
    GetProductById: jest.fn().mockResolvedValue({ data: {
        _id: 'product-1', name: 'Sedan Ejecutivo', type: 'Sedan', price: 25000,
    } }),
})));

const productRoutes = require('../../src/api/products');
const HandleErrors = require('../../src/utils/error-handler');

const createApp = () => {
    const app = express();
    app.use(express.json());
    app.use('/products', productRoutes);
    app.use(HandleErrors);
    return app;
};

describe('products HTTP routes', () => {
    test('lists products', async () => {
        const response = await request(createApp()).get('/products');
        expect(response.statusCode).toBe(200);
        expect(response.body.products).toHaveLength(1);
    });

    test('returns a product by ID', async () => {
        const response = await request(createApp()).get('/products/product-1');
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('Sedan Ejecutivo');
    });
});
