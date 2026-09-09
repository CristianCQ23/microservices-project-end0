const ProductRepository = require('../../src/database/repository/product-repository');
const { ProductModel } = require('../../src/database/models');
const { NotFoundError } = require('../../src/utils/app-errors');

jest.mock('../../src/database/models', () => ({
    ProductModel: {
        find: jest.fn(),
        findById: jest.fn(),
    },
}));

describe('ProductRepository', () => {
    beforeEach(() => jest.clearAllMocks());

    test('finds all products', async () => {
        const products = [{ name: 'Sedan' }];
        ProductModel.find.mockResolvedValue(products);

        await expect(new ProductRepository().FindAll()).resolves.toEqual(products);
        expect(ProductModel.find).toHaveBeenCalledWith({});
    });

    test('throws when a product does not exist', async () => {
        ProductModel.findById.mockResolvedValue(null);

        await expect(new ProductRepository().FindById('missing'))
            .rejects.toBeInstanceOf(NotFoundError);
    });
});
