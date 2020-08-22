import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
    isEmail (): boolean {
        return true
    }
}))

const mackSutFactory = (): EmailValidatorAdapter => {
    return new EmailValidatorAdapter()
}

describe('EmailValidator adapter', () => {
    test('Should be return false when validator return false', () => {
        const sut = mackSutFactory()
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const isValid = sut.isValid('invalid@email.com.br')
        expect(isValid).toBe(false)
    })

    test('Should be return true when validator return true', () => {
        const sut = mackSutFactory()
        const isValid = sut.isValid('valid@email.com.br')
        expect(isValid).toBe(true)
    })

    test('Should be call validator with correct email', () => {
        const sut = mackSutFactory()
        const isEmailSpy = jest.spyOn(validator, 'isEmail')
        sut.isValid('any@email.com.br')
        expect(isEmailSpy).toHaveBeenCalledWith('any@email.com.br')
    })
})
