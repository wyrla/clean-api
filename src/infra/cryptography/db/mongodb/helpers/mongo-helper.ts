import { type Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,
  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },
  async disconnect (): Promise<void> {
    await this.client.close()
  },
  async getCollection (name: string): Promise<Collection> {
    if (!this.client) await this.connect(this.uri)
    return this.client.db().collection(name)
  },
  map (document: any): any {
    const { _id, ...data } = document
    return { id: String(_id), ...data }
  }
}

// export class MongoHelper {
//   private _client: MongoClient

//   async connect (uri: string): Promise<void> {
//     this._client = await MongoClient.connect(uri)
//   }

//   async disconnect (): Promise<void> {
//     await this._client.close()
//   }

//   getCollection (name: string): Collection {
//     return this._client.db().collection(name)
//   }

//   map (document: any): any {
//     const { _id, ...data } = document
//     return { id: String(_id), ...data }
//   }

//   public get client (): MongoClient {
//     return this._client
//   }

//   public set client (mongoClient: MongoClient) {
//     this._client = mongoClient
//   }
// }

// export const mongoHelper = new MongoHelper()
