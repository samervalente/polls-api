import { IHttpResponse } from '../protocols/http';
import { ServerError } from '../errors';

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error
});

export const internalServerError = (): IHttpResponse => ({
  statusCode: 500,
  body: new ServerError()
});

export const created = (data: any): IHttpResponse => ({
  statusCode: 201,
  body: data
});
