process.env.APP_SECRET = 'test-secret';

const {
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
    FormateData,
} = require('../../src/utils');

describe('customer authentication utilities', () => {
    test('hashes and validates a password', async () => {
        const salt = await GenerateSalt();
        const hash = await GeneratePassword('secret123', salt);

        await expect(ValidatePassword('secret123', hash)).resolves.toBe(true);
        await expect(ValidatePassword('wrong-password', hash)).resolves.toBe(false);
    });

    test('creates a verifiable JWT', async () => {
        const token = await GenerateSignature({ _id: 'customer-1' });
        expect(token).toEqual(expect.any(String));
    });

    test('formats service data', () => {
        expect(FormateData({ ok: true })).toEqual({ data: { ok: true } });
    });
});
