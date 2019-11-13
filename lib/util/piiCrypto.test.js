const piiCrypto = require('./piiCrypto');

test('decrypt should work against encrypted input', () => {
    const input = "Hello World";
    const encryptedStr = piiCrypto.encryptPii(input);
    expect(encryptedStr).not.toBe(input);
    const decryptedStr = piiCrypto.decryptPii(encryptedStr);
    expect(decryptedStr).toBe(input);
});

test('hmac should hash the userId', () => {
    const userId = 'test@foo.com';
    const hashedUserId = piiCrypto.hashUserId(userId);
    expect(hashedUserId).not.toBe(userId);
});