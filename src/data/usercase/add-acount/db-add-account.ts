import { AddAccount, AddAccountModel } from '../../../domain/usercase/add-account'
import { AccountModel } from '../../../domain/models/account'
import { Encryption } from '../../protocols/encryption'

export class DbAddAccount implements AddAccount {
    private readonly encryption: Encryption

    constructor (encryption: Encryption) {
        this.encryption = encryption
    }

    async add (account: AddAccountModel): Promise<AccountModel> {
        await this.encryption.encrypt(account.password)
        return Promise.resolve({
            id: 'string',
            name: 'string',
            email: 'string',
            password: 'string'
        })
    }
}
