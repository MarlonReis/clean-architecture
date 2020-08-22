import { DbAddAccount } from './db-add-account'
import { Encryption } from '../../protocols/encryption'

describe('DbAddAccount UseCase', () => {
    class EncryptionStub implements Encryption {
       async encrypt (data: string): Promise<string> {
            return Promise.resolve('hash_password_valid')
        }
    }

    test('Should be call Encrypt with correct password', async () => {
        const encryptionStub = new EncryptionStub()
        const sut = new DbAddAccount(encryptionStub)
        const encryptSpy = jest.spyOn(encryptionStub, 'encrypt')
        await sut.add({
            name: 'Valid Name',
            email: 'valid@email.com',
            password: 'V4l1d@Pwd'
        })
        expect(encryptSpy).toHaveBeenCalledWith('V4l1d@Pwd')
    })
})
