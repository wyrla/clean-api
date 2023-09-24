import { MongoClient } from "mongodb"

export class MongoHelper {
    private client: MongoClient

    async connect(uri: string): Promise<void> {
        this.client = await MongoClient.connect(uri)
    }

    async disconnect(): Promise<void> {
        this.client.close()
    }
}