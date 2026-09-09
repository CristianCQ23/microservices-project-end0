const { APIError, BadRequestError, STATUS_CODES } = require('../../src/utils/app-errors');

describe('shopping errors', () => {
    test('uses the expected HTTP status codes', () => {
        expect(new BadRequestError('Cart is empty').statusCode).toBe(STATUS_CODES.BAD_REQUEST);
        expect(new APIError('Failure').statusCode).toBe(STATUS_CODES.INTERNAL_ERROR);
    });
});
