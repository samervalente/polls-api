import { Encrypter } from '@/data/protocols/encrypter';
import { AddAccount } from '@/domain/use-cases/add-account';
import { DBAddAccount } from './db-add-account';

interface ITestEnviroment {
  sut: AddAccount;
  encrypterStub: Encrypter;
}

const makeTestEnvironment = (): ITestEnviroment => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
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
});
