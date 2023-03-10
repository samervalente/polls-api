import { SignupController } from './signup';
import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { EmailValidator } from '../protocols';

interface IEnviroment {
  sut: SignupController;
  emailValidatorStub: EmailValidator;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeTestEnviroment = (): IEnviroment => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new SignupController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub
  };
};

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeTestEnviroment();
    const httpRequest = {
      body: {
        email: 'fake_email@mail.com',
        password: 'fake_password',
        passwordConfirmation: 'fake_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeTestEnviroment();
    const httpRequest = {
      body: {
        name: 'fake name',
        password: 'fake_password',
        passwordConfirmation: 'fake_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeTestEnviroment();
    const httpRequest = {
      body: {
        name: 'fake name',
        email: 'fake_email@mail.com',
        passwordConfirmation: 'fake_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeTestEnviroment();
    const httpRequest = {
      body: {
        name: 'fake name',
        email: 'fake_email@mail.com',
        password: 'fake_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });

  test('Should return 400 if email is invalid', () => {
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
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('Should call EmailValidator with correct email', () => {
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
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  test('Should return 500 if EmailValidator throw new exception', () => {
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
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
