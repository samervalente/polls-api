interface IHttpRequest {
  body: {
    email: string;
    password: string;
    passwordConfirmation: string;
  };
}

export class SignupController {
  handle(httpRequest: IHttpRequest): any {
    return {
      statusCode: 400
    };
  }
}
