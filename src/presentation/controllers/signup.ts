import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../error/missing-param-error'
import { badRequest } from '../helper/http-helper'
import { Controller } from '../protocols/controller'

export class SingUpController implements Controller {
  handle = (httpRequest: HttpRequest): HttpResponse => {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (httpRequest.body[field] === undefined) {
        return badRequest(new MissingParamError(field))
      }
    }

    return badRequest(new MissingParamError('email'))
  }
}
