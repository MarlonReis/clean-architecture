import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })
    afterAll(async () => {
        await MongoHelper.disconnect()
    })
    test('Should be return and account on success', async () => {
        const sut = new AccountMongoRepository()
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
