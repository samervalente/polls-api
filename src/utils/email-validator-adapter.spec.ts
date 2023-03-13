import validator from 'validator';
import { EmailValidatorAdapter } from './email-validator-adapter';

jest.mock('validator', () => ({
  isEmail: () => true
}));

describe('EmailValidatorAdapter', () => {
  test('Should returns false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValidEmail = sut.isValid('invalid_email@mail.com');
    expect(isValidEmail).toBe(false);
  });

  test('Should returns true if validator returns true', () => {
    const sut = new EmailValidatorAdapter();
    const isValidEmail = sut.isValid('valid_email@mail.com');
    expect(isValidEmail).toBe(true);
  });

  test('Should call validator with correct email', () => {
    const sut = new EmailValidatorAdapter();
    sut.isValid('any_email@mail.com');
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
