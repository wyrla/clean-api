import { type Collection } from 'mongodb'
import { MongoHelper } from './helpers/mongo-helper'

export abstract class MongoConnection {
  async getCollection (name: string): Promise<Collection> {
    return await MongoHelper.getCollection(name)
  }

  map (document: any): any {
    return MongoHelper.map(document)
  }
}
