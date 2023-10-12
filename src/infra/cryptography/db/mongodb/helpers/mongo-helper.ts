import { type Collection, MongoClient } from 'mongodb'

export class MongoHelper {
  private static instance?: MongoHelper
  private _client: MongoClient

  static getInstance (): MongoHelper {
    if (MongoHelper.instance === undefined) MongoHelper.instance = new MongoHelper()
    return MongoHelper.instance
  }

  async connect (uri: string): Promise<void> {
    this._client = await MongoClient.connect(uri)
  }

  async disconnect (): Promise<void> {
    await this._client.close()
  }

  async getCollection (name: string): Promise<Collection> {
    return this._client.db().collection(name)
  }

  map (document: any): any {
    const { _id, ...data } = document
    return { id: String(_id), ...data }
  }
}
