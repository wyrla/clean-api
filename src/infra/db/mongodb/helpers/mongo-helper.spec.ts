import env from '../../../../main/config/env'
import { MongoHelper } from './mongo-helper'

describe('Mongo Helper', () => {
  const sut = MongoHelper.getInstance()

  beforeAll(async () => {
    await sut.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should reconnect if db is disconnected', async () => {
    let accountCollection = sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })

  test('Should return a document mapped to the controller', () => {
    const mapped = sut.map({
      _id: 'any_id',
      name: 'any_name'
    })

    expect(mapped).toEqual({
      id: 'any_id',
      name: 'any_name'
    })
  })
})
