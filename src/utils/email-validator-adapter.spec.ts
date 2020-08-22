import { EmailValidatorAdapter } from './email-validator-adapter'
describe('EmailValidator adapter', () => {
    test('Should be return false when validator return false', () => {
        const sut = new EmailValidatorAdapter()
        const isValid = sut.isValid('invalid@email.com.br')
        expect(isValid).toBe(false)
    })
})
