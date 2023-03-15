import { Account } from '@/entities/account';
import { AccountModel } from '../../domain/models/account';

export interface AddAccountRepository {
  add: (account: AccountModel) => Promise<Account>;
}
