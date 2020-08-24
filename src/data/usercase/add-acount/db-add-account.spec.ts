import { DbAddAccount } from './db-add-account'
import { Encryption, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-protocols'

const makeEncryptionStubFactory = (): Encryption => {
    class EncryptionStub implements Encryption {
        async encrypt (data: string): Promise<string> {
            return Promise.resolve('hash_password_valid')
        }
    }
    return new EncryptionStub()
}

const makeAddAddAccountStubFactory = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add (accountData: AddAccountModel): Promise<AccountModel> {
            const fakeAccount: AccountModel = {
                id: 'valid_id',
                name: 'Valid Name',
                email: 'valid@email.com',
                password: 'hash_password_valid'
            }
            return Promise.resolve(fakeAccount)
        }
    }
    return new AddAccountRepositoryStub()
}

interface SutTypes {
    sut: DbAddAccount
    encryptionStub: Encryption
    addAccountRepositoryStub: AddAccountRepository
}

const makeSutFactory = (): SutTypes => {
    const addAccountRepositoryStub = makeAddAddAccountStubFactory()
    const encryptionStub = makeEncryptionStubFactory()
    const sut = new DbAddAccount(encryptionStub, addAccountRepositoryStub)
    return { sut, encryptionStub, addAccountRepositoryStub }
}

describe('DbAddAccount UseCase with Encryption', () => {
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

describe('DbAddAccount UseCase with AddAccountRepository', () => {
    test('Should be call addAccountRepository with correct account', async () => {
        const { addAccountRepositoryStub, sut } = makeSutFactory()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        const accountData = {
            name: 'Valid Name',
            email: 'valid@email.com',
            password: 'V4l1d@Pwd'
        }
        await sut.add(accountData)
        await expect(addSpy).toHaveBeenCalledWith({
            ...accountData,
            password: 'hash_password_valid'
        })
    })

    test('Should be throws when AddAccountRepository throws error', async () => {
        const { addAccountRepositoryStub, sut } = makeSutFactory()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
        const accountPromise = sut.add({
            name: 'Valid Name',
            email: 'valid@email.com',
            password: 'V4l1d@Pwd'
        })
        await expect(accountPromise).rejects.toThrow()
    })

    test('Should be return an account on success', async () => {
        const { sut } = makeSutFactory()
        const account = await sut.add({
            name: 'Valid Name',
            email: 'valid@email.com',
            password: 'V4l1d@Pwd'
        })

        expect(account).toEqual({
             id: 'valid_id',
             name: 'Valid Name',
             email: 'valid@email.com',
             password: 'hash_password_valid'
        })
    })
})
