import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
    isEmail (): boolean {
        return true
    }
}))

describe('EmailValidator adapter', () => {
    test('Should be return false when validator return false', () => {
        const sut = new EmailValidatorAdapter()
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const isValid = sut.isValid('invalid@email.com.br')
        expect(isValid).toBe(false)
    })

    test('Should be return true when validator return true', () => {
        const sut = new EmailValidatorAdapter()
        const isValid = sut.isValid('valid@email.com.br')
        expect(isValid).toBe(true)
    })
})
