import { Account } from '../../entities/account';
import { AccountModel } from '../models/account';

export abstract class AddAccount {
  abstract add(account: AccountModel): Account;
}
