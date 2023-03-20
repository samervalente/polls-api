import { AddAccountRepository } from '@/data/protocols/add-account-repository';
import { Account, Encrypter } from './db-add-account-protocols';

export const makeEncrypter = () => {
  class EncrypterStub implements Encrypter {
    async encrypt(): Promise<string> {
      return Promise.resolve('hashed_password');
    }
  }

  return new EncrypterStub();
};

export const makeAddAccountRepository = () => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(): Promise<Account> {
      return Promise.resolve({
        id: 'valid_id',
        name: 'valid_fake_name',
        email: 'valid_fake_mail@gmail.com',
        password: 'hashed_password'
      });
    }
  }

  return new AddAccountRepositoryStub();
};
