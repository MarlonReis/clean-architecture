import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../error/missing-param-error'

export class SingUpController {
  handle = (httpRequest: HttpRequest): HttpResponse => {
    if (httpRequest.body.name === undefined) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }

    return {
      statusCode: 400,
      body: new MissingParamError('email')
    }
  }
}
