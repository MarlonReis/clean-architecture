import { DbAddAccount } from './db-add-account'
import { Encryption } from '../../protocols/encryption'

interface SutTypes {
    sut: DbAddAccount
    encryptionStub: Encryption
}

const makeEncryptionStubFactory = (): Encryption => {
    class EncryptionStub implements Encryption {
        async encrypt (data: string): Promise<string> {
            return Promise.resolve('hash_password_valid')
        }
    }
    return new EncryptionStub()
}

const makeSutFactory = (): SutTypes => {
    const encryptionStub = makeEncryptionStubFactory()
    const sut = new DbAddAccount(encryptionStub)
    return { sut, encryptionStub }
}

describe('DbAddAccount UseCase', () => {
    test('Should be call Encrypt with correct password', async () => {
        const { encryptionStub, sut } = makeSutFactory()

        const encryptSpy = jest.spyOn(encryptionStub, 'encrypt')
        await sut.add({
            name: 'Valid Name',
            email: 'valid@email.com',
            password: 'V4l1d@Pwd'
        })
        expect(encryptSpy).toHaveBeenCalledWith('V4l1d@Pwd')
    })

    test('Should be throws when Encrypt throws', async () => {
        const { encryptionStub, sut } = makeSutFactory()
        jest.spyOn(encryptionStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
        const accountPromise = sut.add({
            name: 'Valid Name',
            email: 'valid@email.com',
            password: 'V4l1d@Pwd'
        })
        await expect(accountPromise).rejects.toThrow()
    })
})
