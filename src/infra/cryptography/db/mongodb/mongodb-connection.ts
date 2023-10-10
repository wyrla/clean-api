import { type Collection } from 'mongodb'
import { mongoHelper } from './helpers/mongo-helper'

export abstract class MongoConnection {
  async getCollection (name: string): Promise<Collection> {
    return mongoHelper.getCollection(name)
  }

  map (document: any): any {
    return mongoHelper.map(document)
  }
}
