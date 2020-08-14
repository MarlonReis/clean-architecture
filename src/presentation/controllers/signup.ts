import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../error/missing-param-error'
import { badRequest } from '../helper/http-helper'

export class SingUpController {
  handle = (httpRequest: HttpRequest): HttpResponse => {
    if (httpRequest.body.name === undefined) {
      return badRequest(new MissingParamError('name'))
    }

    return badRequest(new MissingParamError('email'))
  }
}
