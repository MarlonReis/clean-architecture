import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    beforeEach(async () => {
        const accountCollection = MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    const makeSutAccountMongoRepositoryFactory = (): AccountMongoRepository => {
        return new AccountMongoRepository()
    }
    test('Should be return and account on success', async () => {
        const sut = makeSutAccountMongoRepositoryFactory()
        const account = await sut.add({
            name: 'Any Name',
            email: 'any@email.com',
            password: 'AnyPassword'
        })
        expect(account).toBeTruthy()
        expect(account.id).toBeDefined()
        expect(account.name).toBe('Any Name')
        expect(account.email).toBe('any@email.com')
        expect(account.password).toBe('AnyPassword')
    })
})
