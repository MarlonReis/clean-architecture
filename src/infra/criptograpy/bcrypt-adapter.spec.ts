import bcrypt from 'bcrypt'

import { BCryptAdapter } from './bcrypt-adapter'

describe('Bcrypt adapter ', () => {
    test('Should be call bcrypt with correct values', async () => {
        const salt = 12
        const sut = new BCryptAdapter(salt)
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('anyValue')
        expect(hashSpy).toHaveBeenCalledWith('anyValue', salt)
    })
})
