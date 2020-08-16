import { SingUpController } from './signup'
import { MissingParamError } from '../error/missing-param-error'
import { InvalidParamError } from '../error/invalid-param-error'
import { ServerError } from '../error/server-error'
import { EmailValidator } from '../protocols/email-validator'

interface SutTypes {
  sut: SingUpController
  emailValidatorStub: EmailValidator
}

const makeSutFactory = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid = (email: string): boolean => {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SingUpController(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('SingUp controller', () => {
  test('Should be return http status 400 when no name is provided', () => {
    const { sut } = makeSutFactory()
    const httpRequest = {
      body: {
        email: 'exemple@email.com.br',
        password: '4nyP4ssW0rd',
        passwordConfirmation: '4nyP4ssW0rd'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse).toEqual(expect.objectContaining({
      statusCode: 400,
      body: new MissingParamError('name')
    }))
  })

  test('Should be return http status 400 when no email is provided', () => {
    const { sut } = makeSutFactory()
    const httpRequest = {
      body: {
        name: 'Any Name',
        password: '4nyP4ssW0rd',
        passwordConfirmation: '4nyP4ssW0rd'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse).toEqual(expect.objectContaining({
      statusCode: 400,
      body: new MissingParamError('email')
    }))
  })

  test('Should be return http status 400 when no password is provided', () => {
    const { sut } = makeSutFactory()
    const httpRequest = {
      body: {
        name: 'Any Name',
        email: 'exemple@email.com'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse).toEqual(expect.objectContaining({
      statusCode: 400,
      body: new MissingParamError('password')
    }))
  })

  test('Should be return http status 400 when no password confirmation is provided', () => {
    const { sut } = makeSutFactory()
    const httpRequest = {
      body: {
        name: 'Any Name',
        email: 'exemple@email.com',
        password: '4nyP4ssW0rd'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse).toEqual(expect.objectContaining({
      statusCode: 400,
      body: new MissingParamError('passwordConfirmation')
    }))
  })

  test('Should be return http status 400 when email invalid', () => {
    const { sut, emailValidatorStub } = makeSutFactory()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'Any Name',
        email: 'invalid@email.com',
        password: '4nyP4ssW0rd',
        passwordConfirmation: '4nyP4ssW0rd'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse).toEqual(expect.objectContaining({
      statusCode: 400,
      body: new InvalidParamError('email')
    }))
  })

  test('Should be call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSutFactory()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'Any Name',
        email: 'any-valid@email.com',
        password: '4nyP4ssW0rd',
        passwordConfirmation: '4nyP4ssW0rd'
      }
    }

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any-valid@email.com')
  })

  test('Should be return status http 500 when emailValidate throws exceptions', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid = (email: string): boolean => {
        throw new ServerError()
      }
    }

    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SingUpController(emailValidatorStub)

    const httpRequest = {
      body: {
        name: 'Any Name',
        email: 'any-valid@email.com',
        password: '4nyP4ssW0rd',
        passwordConfirmation: '4nyP4ssW0rd'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse).toEqual(expect.objectContaining({
      statusCode: 500,
      body: new ServerError()
    }))
  })
})
