import { HttpRequest, HttpResponse } from '../protocols/http'
import {
  MissingParamError,
  InvalidParamError
} from '../error'

import { badRequest, serverError } from '../helper/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle = (httpRequest: HttpRequest): HttpResponse => {
    try {
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
    } catch (error) {
      return serverError()
    }
    return badRequest(new MissingParamError('email'))
  }
}
