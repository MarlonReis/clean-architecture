import { SingUpController } from './signup'
import { MissingParamError } from '../error/missing-param-error'

const makeSutFactory = (): SingUpController => {
  return new SingUpController()
}

describe('SingUp controller', () => {
  test('Should be return http status 400 when no name is provided', () => {
    const sut = makeSutFactory()
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
    const sut = makeSutFactory()
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
    const sut = makeSutFactory()
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
    const sut = makeSutFactory()
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
})
