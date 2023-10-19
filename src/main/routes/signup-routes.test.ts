import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Sign Up Routes', () => {
  const mongoDbHelper = MongoHelper.getInstance()

  beforeAll(async () => {
    await mongoDbHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    const accountCollection = await mongoDbHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await mongoDbHelper.disconnect()
  })

  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any_name',
        email: 'any_email@provider.com',
        password: 'any_password',
        confirmPassword: 'any_password'
      })
      .expect(200)
  })
})
