export interface IHttpResponse {
    statusCode:number
    body: any
}

export interface IHttpRequest {
    body?: any;
  }

export interface IUser {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  }
  
 