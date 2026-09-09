process.env.APP_SECRET = 'test-secret';

const jwt = require('jsonwebtoken');
const auth = require('../../src/api/middlewares/auth');

describe('shopping auth middleware', () => {
    test('rejects missing authorization', () => {
        const next = jest.fn();
        auth({ headers: {} }, {}, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    });

    test('sets the user for a valid token', () => {
        const token = jwt.sign({ _id: 'customer-1' }, process.env.APP_SECRET);
        const next = jest.fn();
        const request = { headers: { authorization: `Bearer ${token}` } };

        auth(request, {}, next);

        expect(request.user._id).toBe('customer-1');
        expect(next).toHaveBeenCalledWith();
    });
});
