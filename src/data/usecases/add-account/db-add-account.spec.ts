import { Encrypter } from './db-add-account-protocols';
import { DBAddAccount } from './db-add-account';

interface ITestEnviroment {
  sut: DBAddAccount;
  encrypterStub: Encrypter;
}

const makeTestEnvironment = (): ITestEnviroment => {
  class EncrypterStub implements Encrypter {
    async encrypt(): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }

  const encrypterStub = new EncrypterStub();
  const sut = new DBAddAccount(encrypterStub);
  return {
    sut,
    encrypterStub
  };
};

describe('Tests for DBAddAccount usecase', () => {
  test('Should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeTestEnvironment();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_fake_name',
      email: 'valid_fake_mail@gmail.com',
      password: 'valid_fake_password'
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password);
  });

  test('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeTestEnvironment();

    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      name: 'valid_fake_name',
      email: 'valid_fake_mail@gmail.com',
      password: 'valid_fake_password'
    };
    const promise = sut.add(accountData);
    expect(promise).rejects.toThrow();
  });
});