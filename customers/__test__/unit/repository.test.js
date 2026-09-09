const CustomerRepository = require('../../src/database/repository/customer-repository');
const { BadRequestError } = require('../../src/utils/app-errors');
const { CustomerModel } = require('../../src/database/models');

jest.mock('../../src/database/models', () => ({
    CustomerModel: {
        findById: jest.fn(),
    },
    AddressModel: {},
}));

describe('CustomerRepository cart', () => {
    beforeEach(() => jest.clearAllMocks());

    test('adds a product with its quantity', async () => {
        const customer = {
            cart: [],
            save: jest.fn(),
        };
        CustomerModel.findById.mockResolvedValue(customer);

        const repository = new CustomerRepository();
        const result = await repository.AddToCart('customer-1', {
            _id: 'product-1',
            name: 'Sedan',
            price: 25000,
        }, 1);

        expect(result[0].product).toMatchObject({ _id: 'product-1', name: 'Sedan' });
        expect(result[0].unit).toBe(1);
        expect(customer.save).toHaveBeenCalled();
    });

    test('rejects an invalid quantity', async () => {
        CustomerModel.findById.mockResolvedValue({ cart: [], save: jest.fn() });
        const repository = new CustomerRepository();

        await expect(repository.AddToCart('customer-1', { _id: 'product-1' }, 0))
            .rejects.toBeInstanceOf(BadRequestError);
    });
});
