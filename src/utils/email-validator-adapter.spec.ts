import { EmailValidatorAdapter } from './email-validator-adapter';

describe('EmailValidatorAdapter', () => {
  test('Should return false if EmailValidator returns false', () => {
    const sut = new EmailValidatorAdapter();
    const isValidEmail = sut.isValid('invalid_email@mail.com');
    expect(isValidEmail).toBe(false);
  });
});
