import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('account');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  test('Should return an account on success', async () => {
    const sut = makeSut();
    const accountData = {
      name: 'fake_name',
      email: 'fake_email@mail.com',
      password: 'fake_hashed_password'
    };
    const account = await sut.add(accountData);
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe(accountData.name);
    expect(account.email).toBe(accountData.email);
    expect(account.password).toBe(accountData.password);
  });
});
