import { IHttpRequest, IHttpResponse, Controller } from '../protocols';
import { MissingParamError, InvalidParamError } from '../errors';
import { badRequest, internalServerError } from '../helpers';
import { EmailValidator } from '../protocols/email-validator';

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields = [
        'email',
        'name',
        'password',
        'passwordConfirmation'
      ];

      const { email, password, passwordConfirmation } = httpRequest.body;

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

      return {
        statusCode: 200,
        body: 'User registered successfully!'
      };
    } catch (error) {
      console.log(error);
      return internalServerError();
    }
  }
}
