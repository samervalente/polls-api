import {
  AddAccount,
  Encrypter,
  AccountModel,
  Account,
  AddAccountRepository
} from './db-add-account-protocols';

export class DBAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  private readonly addAccountRepository: AddAccountRepository;
  constructor(
    encrypter: Encrypter,
    addAccountRepository: AddAccountRepository
  ) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }
  async add(account: AccountModel): Promise<Account> {
    const hashedPassword = await this.encrypter.encrypt(account.password);
    const createdAccount = await this.addAccountRepository.add(
      Object.assign({}, account, { password: hashedPassword })
    );

    //or
    // await this.addAccountRepository.add({
    //   ...account,
    //   password: hashedPassword
    // });
    return createdAccount;
  }
}
