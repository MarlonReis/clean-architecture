import bcrypt from 'bcrypt'

import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
    async hash (): Promise<string> {
        return await Promise.resolve('hash')
    }
}))

const salt = 12
const makeSutBCryptAdapterFactory = (): BCryptAdapter => {
    return new BCryptAdapter(salt)
}

describe('Bcrypt adapter ', () => {
    test('Should be call bcrypt with correct values', async () => {
        const sut = makeSutBCryptAdapterFactory()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('anyValue')
        expect(hashSpy).toHaveBeenCalledWith('anyValue', salt)
    })

    test('Should be return a hash on success', async () => {
        const sut = makeSutBCryptAdapterFactory()
        const hash = await sut.encrypt('anyValue')
        expect(hash).toBe('hash')
    })

    test('Should be throws when bcrypt throws error', async () => {
        const sut = makeSutBCryptAdapterFactory()
        jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
        const hashPromise = sut.encrypt('anyValue')
        await expect(hashPromise).rejects.toThrow()
    })
})
