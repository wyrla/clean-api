import { type Collection } from 'mongodb'
import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log.repository'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Log MongoDb Repository', () => {
  const mongoDbHelper = MongoHelper.getInstance()
  let errorCollection: Collection

  beforeAll(async () => {
    await mongoDbHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    errorCollection = await mongoDbHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  afterAll(async () => {
    await mongoDbHelper.disconnect()
  })

  test('should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_stack')
    const result = await errorCollection.countDocuments()
    expect(result).toBe(1)
  })
})
