import {
  IHttpRequest,
  IHttpResponse,
  Controller,
  AddAccount,
  EmailValidator
} from './signup-protocol';
import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, internalServerError, created } from '../../helpers';

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;
  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
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

      const account = await this.addAccount.add({
        name,
        email,
        password
      });

      return created(account);
    } catch (error) {
      return internalServerError();
    }
  }
}
