import { type LogErrorRepository } from '../../../../data/protocols/log-error-repository'
import { MongoConnection } from '../mongodb-connection'

export class LogMongoRepository extends MongoConnection implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await this.getCollection('errors')
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
