import { SignupController } from '../signup/signup';
import {
  InvalidParamError,
  MissingParamError,
  ServerError
} from '../../errors';
import {
  EmailValidator,
  AddAccount,
  Account,
  AccountModel
} from './signup-protocol';
import { rejects } from 'assert';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AccountModel): Promise<Account> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'fake name',
        email: 'fake_email@mail.com',
        password: 'fake_password'
      };
      return new Promise((resolve) => resolve(fakeAccount)); // retorna uma promise com o fake account
    }
  }

  return new AddAccountStub();
};

interface IEnviroment {
  sut: SignupController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeTestEnviroment = (): IEnviroment => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignupController(emailValidatorStub, addAccountStub);

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  };
};

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeTestEnviroment();
    const httpRequest = {
      body: {
        email: 'fake_email@mail.com',
        password: 'fake_password',
        passwordConfirmation: 'fake_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeTestEnviroment();
    const httpRequest = {
      body: {
        name: 'fake name',
        password: 'fake_password',
        passwordConfirmation: 'fake_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeTestEnviroment();
    const httpRequest = {
      body: {
        name: 'fake name',
        email: 'fake_email@mail.com',
        passwordConfirmation: 'fake_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeTestEnviroment();
    const httpRequest = {
      body: {
        name: 'fake name',
        email: 'fake_email@mail.com',
        password: 'fake_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });

  test('Should return 400 if passwordConfirmation fails', async () => {
    const { sut } = makeTestEnviroment();
    const httpRequest = {
      body: {
        name: 'fake name',
        email: 'invalid_fake_email@mail.com',
        password: 'fake_password',
        passwordConfirmation: 'another_faker_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    );
  });

  test('Should return 400 if email is invalid', async () => {
    const { sut, emailValidatorStub } = makeTestEnviroment();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: 'fake name',
        email: 'invalid_fake_email@mail.com',
        password: 'fake_password',
        passwordConfirmation: 'fake_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeTestEnviroment();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httpRequest = {
      body: {
        name: 'fake name',
        email: 'fake_email@mail.com',
        password: 'fake_password',
        passwordConfirmation: 'fake_password'
      }
    };
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  test('Should return 500 if EmailValidator throw new exception', async () => {
    const { sut, emailValidatorStub } = makeTestEnviroment();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'fake name',
        email: 'fake_email@mail.com',
        password: 'fake_password',
        passwordConfirmation: 'fake_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('Should call addAccount use-case with correct values', async () => {
    const { sut, addAccountStub } = makeTestEnviroment();
    const isValidAddAccountSpy = jest.spyOn(addAccountStub, 'add');

    const httpRequest = {
      body: {
        name: 'fake name',
        email: 'fake_email@mail.com',
        password: 'fake_password',
        passwordConfirmation: 'fake_password'
      }
    };
    await sut.handle(httpRequest);

    expect(isValidAddAccountSpy).toHaveBeenCalledWith({
      name: 'fake name',
      email: 'fake_email@mail.com',
      password: 'fake_password'
    });
  });

  test('Should return 500 if addAccount throws new exception', async () => {
    const { sut, addAccountStub } = makeTestEnviroment();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const httpRequest = {
      body: {
        name: 'fake name',
        email: 'fake_email@mail.com',
        password: 'fake_password',
        passwordConfirmation: 'fake_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('Should return 201 if a valid account data is provided', async () => {
    const { sut } = makeTestEnviroment();
    const httpRequest = {
      body: {
        name: 'fake name',
        email: 'fake_email@mail.com',
        password: 'fake_password',
        passwordConfirmation: 'fake_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(201);
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'fake name',
      email: 'fake_email@mail.com',
      password: 'fake_password'
    });
    expect(httpResponse.body.id).toBeDefined();
  });
});
