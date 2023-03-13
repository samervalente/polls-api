import { Account } from '../../entities/account';
import { AccountModel } from '../models/account';

export abstract class AddAccount {
  abstract add(account: AccountModel): Promise<Account>; //add function signature
}

//or
export interface AddAccountInterface {
  add(account: AccountModel): Promise<Account>; //add function signature
}
