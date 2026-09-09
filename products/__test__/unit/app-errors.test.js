const { APIError, NotFoundError, STATUS_CODES } = require('../../src/utils/app-errors');

describe('product errors', () => {
    test('creates an API error with status and message', () => {
        const error = new APIError('Example', STATUS_CODES.BAD_REQUEST, 'Invalid product');
        expect(error.name).toBe('Example');
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Invalid product');
    });

    test('creates a not found error', () => {
        const error = new NotFoundError('Product not found');
        expect(error.statusCode).toBe(404);
    });
});
