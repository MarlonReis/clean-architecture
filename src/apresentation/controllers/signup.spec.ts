import { SingUpController } from './signup'

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
    expect(httpResponse.statusCode).toBe(400)
  })
})
