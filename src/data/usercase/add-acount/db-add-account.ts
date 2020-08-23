import {
    AddAccount, AddAccountModel,
    AccountModel, Encryption,
    AddAccountRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
    private readonly encryption: Encryption
    private readonly addAccountRepository: AddAccountRepository

    constructor (encryption: Encryption, addAccountRepository: AddAccountRepository) {
        this.encryption = encryption
        this.addAccountRepository = addAccountRepository
    }

    async add (account: AddAccountModel): Promise<AccountModel> {
        const hasPassword = await this.encryption.encrypt(account.password)
        return await this.addAccountRepository.add({
            ...account,
            password: hasPassword
        })
    }
}
