import { Encrypter } from './db-add-account-protocols';
import { DBAddAccount } from './db-add-account';
import { AddAccountRepository } from '@/data/protocols/add-account-repository';
import {
  makeAddAccountRepository,
  makeEncrypter
} from './db-add-account-factorie';

interface ITestEnviroment {
  sut: DBAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeTestEnvironment = (): ITestEnviroment => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DBAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
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

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeTestEnvironment();

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const accountData = {
      name: 'valid_fake_name',
      email: 'valid_fake_mail@gmail.com',
      password: 'valid_fake_password'
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      ...accountData,
      password: 'hashed_password'
    });
  });

  test('Should throw if encrypter throws', async () => {
    const { sut, addAccountRepositoryStub } = makeTestEnvironment();

    jest
      .spyOn(addAccountRepositoryStub, 'add')
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

  test('Should return a valid account', async () => {
    const { sut } = makeTestEnvironment();

    const accountData = {
      name: 'valid_fake_name',
      email: 'valid_fake_mail@gmail.com',
      password: 'valid_fake_password'
    };
    const createdAccount = await sut.add(accountData);
    expect(createdAccount).toEqual({
      id: 'valid_id',
      ...accountData,
      password: 'hashed_password'
    });
  });
});
