import {
  AddAccount,
  Encrypter,
  AccountModel,
  Account
} from './db-add-account-protocols';

export class DBAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }
  async add(account: AccountModel): Promise<Account> {
    await this.encrypter.encrypt(account.password);
    return new Promise((resolve) => resolve(null));
  }
}
