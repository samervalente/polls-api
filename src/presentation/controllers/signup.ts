import { IHttpRequest, IHttpResponse } from '../protocols/http';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { Controller } from '../protocols/controller';
import { EmailValidator } from '../protocols/email-validator';
import { InvalidParamError } from '../errors/invalid-param-error';

export class SignupController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  handle(httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = [
      'email',
      'name',
      'password',
      'passwordConfirmation'
    ];

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);
    if (!isValidEmail) {
      return badRequest(new InvalidParamError('email'));
    }

    return {
      statusCode: 200,
      body: 'User registered successfully!'
    };
  }
}
