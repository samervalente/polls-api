import bcrypt from 'bcrypt';
import { BCryptAdapter } from './bcrypt-adapter';

const saltRounds = 12;
const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(saltRounds);
};

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => Promise.resolve('hashed_value')
}));

describe('BcryptAdapter', () => {
  test('Should call encrypt method with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', saltRounds);
  });

  test('Should return a hash on success', async () => {
    const sut = makeSut();
    const hash = await sut.encrypt('any_value');
    expect(hash).toBe('hashed_value');
  });
});
