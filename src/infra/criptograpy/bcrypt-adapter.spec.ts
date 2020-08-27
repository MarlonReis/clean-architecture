import bcrypt from 'bcrypt'

import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
    async hash (): Promise<string> {
        return await Promise.resolve('hash')
    }
}))

describe('Bcrypt adapter ', () => {
    test('Should be call bcrypt with correct values', async () => {
        const salt = 12
        const sut = new BCryptAdapter(salt)
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('anyValue')
        expect(hashSpy).toHaveBeenCalledWith('anyValue', salt)
    })

    test('Should be return a hash on success', async () => {
        const salt = 12
        const sut = new BCryptAdapter(salt)
        const hash = await sut.encrypt('anyValue')
        expect(hash).toBe('hash')
    })
})
