import { Account } from '../entities/account';

export type AccountModel = Omit<Account, 'id'>;
