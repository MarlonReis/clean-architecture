import { AccountModel } from '../../../../domain/models/account'

export const map = (account: any): AccountModel => {
    const { _id, ...accountWithoutId } = account
    return { id: _id, ...accountWithoutId }
}
