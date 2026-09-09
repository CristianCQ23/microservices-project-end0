process.env.APP_SECRET = 'test-secret';

const {
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
    FormateData,
} = require('../../src/utils');

describe('shopping utilities', () => {
    test('hashes and validates passwords', async () => {
        const salt = await GenerateSalt();
        const hash = await GeneratePassword('secret123', salt);

        await expect(ValidatePassword('secret123', hash, salt)).resolves.toBe(true);
        await expect(ValidatePassword('wrong', hash, salt)).resolves.toBe(false);
    });

    test('formats data and signs a token', async () => {
        expect(FormateData('cart')).toEqual({ data: 'cart' });
        await expect(GenerateSignature({ _id: 'customer-1' })).resolves.toEqual(expect.any(String));
    });
});
