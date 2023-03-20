import bcrypt from 'bcrypt';
import { BCryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => Promise.resolve('hashed_value')
}));

describe('BcryptAdapter', () => {
  test('Should call encrypt method with correct values', async () => {
    const saltRounds = 12;
    const sut = new BCryptAdapter(saltRounds);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', 12);
  });

  test('Should return a hash on success', async () => {
    const saltRounds = 12;
    const sut = new BCryptAdapter(saltRounds);
    const hash = await sut.encrypt('any_value');
    expect(hash).toBe('hashed_value');
  });
});
