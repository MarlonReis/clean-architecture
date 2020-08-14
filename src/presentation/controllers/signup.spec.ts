import { SingUpController } from './signup'
import { MissingParamError } from '../error/missing-param-error'

describe('SingUp controller', () => {
  test('Should be return http status 400 when no name is provided', () => {
    const sut = new SingUpController()
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
    const sut = new SingUpController()
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
})
