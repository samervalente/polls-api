import { IHttpRequest, IHttpResponse } from './http';

export abstract class Controller {
  abstract handle(httpRequest: IHttpRequest): IHttpResponse;
}
