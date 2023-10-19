import { type Collection } from 'mongodb'
import { MongoHelper } from './helpers/mongo-helper'

export abstract class MongoConnection {
  constructor (private readonly connection: MongoHelper = MongoHelper.getInstance()) {}

  async getCollection (name: string): Promise<Collection> {
    return await this.connection.getCollection(name)
  }

  map (document: any): any {
    return this.connection.map(document)
  }
}
