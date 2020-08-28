import { MongoClient } from 'mongodb'

export const MongoHelper = {
    mongoClient: undefined as MongoClient,
    async connect (url: string): Promise<void> {
        this.mongoClient = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    },
    async disconnect (): Promise<void> {
       await this.mongoClient.close()
    }
}
