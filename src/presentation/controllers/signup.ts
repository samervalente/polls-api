export interface IUser {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface IHttpRequest {
  body: IUser;
}

export class SignupController {
  handle(httpRequest: any): any {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      };
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email')
      };
    }
  }
}
