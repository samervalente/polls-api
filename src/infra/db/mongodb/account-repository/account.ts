import { AddAccountRepository } from '@/data/protocols/add-account-repository';
import { AccountModel } from '@/domain/models/account';
import { Account } from '@/entities/account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AccountModel): Promise<Account> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const { _id, name, email, password } = await accountCollection.findOne({
      _id: result.insertedId
    });

    return { id: String(_id), name, email, password };
  }
}
