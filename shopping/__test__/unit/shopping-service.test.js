jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

const axios = require('axios');
const ShoppingService = require('../../src/services/shopping-service');
const { BadRequestError } = require('../../src/utils/app-errors');

describe('ShoppingService', () => {
    beforeEach(() => jest.clearAllMocks());

    test('creates an order from the customer cart', async () => {
        axios.get.mockResolvedValue({ data: [
            { product: { _id: 'product-1', price: 25000 }, unit: 2 },
        ] });
        axios.post.mockResolvedValue({ data: { ok: true } });

        const result = await new ShoppingService().PlaceOrder('customer-1', 'txn-1');

        expect(result).toEqual({ data: { ok: true } });
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/cart/customer-1'));
        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/order/customer-1'),
            expect.objectContaining({ amount: 50000, txnId: 'txn-1' })
        );
    });

    test('rejects an empty cart', async () => {
        axios.get.mockResolvedValue({ data: [] });

        await expect(new ShoppingService().PlaceOrder('customer-1', 'txn-1'))
            .rejects.toBeInstanceOf(BadRequestError);
    });
});
