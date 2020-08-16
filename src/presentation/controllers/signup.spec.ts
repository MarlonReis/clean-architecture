import { SingUpController } from './signup'
import {
  MissingParamError,
  InvalidParamError,
  ServerError
} from '../error'

import { EmailValidator } from '../protocols'
import { AccountModel } from '../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../domain/usercase/add-account'

const makeEmailValidatorFactory = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid = (email: string): boolean => {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccountFactory = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add = (account: AddAccountModel): AccountModel => {
      const fakeAccount: AccountModel = {
        id: 'valid_id',
        name: 'valid name',
        email: 'valid@email.com',
        password: 'valid_pwd'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

interface SutTypes {
  sut: SingUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSutFactory = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorFactory()
  const addAccountStub = makeAddAccountFactory()
  const sut = new SingUpController(emailValidatorStub, addAccountStub)
  return { sut, emailValidatorStub, addAccountStub }
}

describe('SingUp controller validations', () => {
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

  test('Should be return http status 400 when no password confirmation fail', () => {
    const { sut } = makeSutFactory()
    const httpRequest = {
      body: {
        name: 'Any Name',
        email: 'exemple@email.com',
        password: '4nyP4ssW0rd',
        passwordConfirmation: 'D1f3r3nt@Pwd'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse).toEqual(expect.objectContaining({
      statusCode: 400,
      body: new InvalidParamError('passwordConfirmation')
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
    const { sut, emailValidatorStub } = makeSutFactory()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new ServerError()
    })

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

describe('SingUp controller addAccount', () => {
  test('Should be call addAccount with correct values', () => {
    const { sut, addAccountStub } = makeSutFactory()
    const addStubSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'Any Name',
        email: 'any-valid@email.com',
        password: '4nyP4ssW0rd',
        passwordConfirmation: '4nyP4ssW0rd'
      }
    }

    sut.handle(httpRequest)
    expect(addStubSpy).toHaveBeenCalledWith({
      name: 'Any Name',
      email: 'any-valid@email.com',
      password: '4nyP4ssW0rd'
    })
  })
})
