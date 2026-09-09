const ProductService = require('../../src/services/products-service');
const { ProductRepository } = require('../../src/database');

jest.mock('../../src/database', () => ({
    ProductRepository: jest.fn(),
}));

describe('ProductsService', () => {
    beforeEach(() => jest.clearAllMocks());

    test('returns products and unique categories', async () => {
        ProductRepository.mockImplementation(() => ({
            FindAll: jest.fn().mockResolvedValue([
                { type: 'Sedan' },
                { type: 'Truck' },
                { type: 'Sedan' },
            ]),
        }));

        const service = new ProductService();
        await expect(service.GetProducts()).resolves.toEqual({
            data: {
                products: [{ type: 'Sedan' }, { type: 'Truck' }, { type: 'Sedan' }],
                categories: ['Sedan', 'Truck'],
            },
        });
    });

    test('returns a product by ID', async () => {
        const product = { _id: 'product-1', name: 'Sedan Ejecutivo' };
        ProductRepository.mockImplementation(() => ({
            FindById: jest.fn().mockResolvedValue(product),
        }));

        const service = new ProductService();
        await expect(service.GetProductById('product-1')).resolves.toEqual({ data: product });
    });
});
