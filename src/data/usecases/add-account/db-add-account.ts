import { Encrypter } from '@/data/protocols/encrypter';
import { AccountModel } from '@/domain/models/account';
import { AddAccount } from '@/domain/use-cases/add-account';
import { Account } from '@/entities/account';

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
