import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../error/missing-param-error'
import { InvalidParamError } from '../error/invalid-param-error'
import { badRequest } from '../helper/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle = (httpRequest: HttpRequest): HttpResponse => {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (httpRequest.body[field] === undefined) {
        return badRequest(new MissingParamError(field))
      }
    }

    const { email } = httpRequest.body
    if (!this.emailValidator.isValid(email)) {
      return badRequest(new InvalidParamError('email'))
    }

    return badRequest(new MissingParamError('email'))
  }
}
