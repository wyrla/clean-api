import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo-helper'

import { AccountMongoRepository } from './account'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  const mongoDbHelper = MongoHelper.getInstance()

  beforeAll(async () => {
    await mongoDbHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    const accountCollection = await mongoDbHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await mongoDbHelper.disconnect()
  })

  test('should return an account on success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@provider.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@provider.com')
    expect(account.password).toBe('any_password')
  })
})
