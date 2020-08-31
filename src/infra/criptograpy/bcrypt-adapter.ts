import bcrypt from 'bcrypt'

import { Encryption } from '../../data/protocols/encryption'

export class BCryptAdapter implements Encryption {
    private readonly salt: number

    constructor (salt: number) {
        this.salt = salt
    }

    async encrypt (data: string): Promise<string> {
        return await bcrypt.hash(data, this.salt)
    }
}
