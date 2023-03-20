import bcrypt from 'bcrypt';
import { BCryptAdapter } from './bcrypt-adapter';

describe('BcryptAdapter', () => {
  test('Should call encrypt method with correct value', async () => {
    const saltRounds = 12;
    const sut = new BCryptAdapter(saltRounds);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value',12);
  });
});
