import { DBAddAccount } from './db-add-account';

class EncrypterStub {
  async encrypt(value: string): Promise<string> {
    return new Promise((resolve) => resolve('hashed_password'));
  }
}

describe('Tests for DBAddAccount usecase', () => {
  test('Should call encrypter with correct password', async () => {
    const encrypterStub = new EncrypterStub();
    const sut = new DBAddAccount(encrypterStub);
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_fake_name',
      email: 'valid_fake_mail@gmail.com',
      password: 'valid_fake_password'
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password);
  });
});
