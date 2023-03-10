import {
  IHttpRequest,
  IHttpResponse,
  Controller,
  AddAccount,
  EmailValidator
} from './signup-protocol';
import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, internalServerError } from '../../helpers';

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;
  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  handle(httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields = [
        'email',
        'name',
        'password',
        'passwordConfirmation'
      ];

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      this.addAccount.add({
        name,
        email,
        password
      });

      return {
        statusCode: 200,
        body: 'User registered successfully!'
      };
    } catch (error) {
      return internalServerError();
    }
  }
}
