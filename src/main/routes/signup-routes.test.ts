import request from 'supertest'
import app from '../config/app'
import { mongoHelper } from '../../infra/cryptography/db/mongodb/helpers/mongo-helper'

describe('Sign Up Routes', () => {
  const mongoDbHelper = mongoHelper

  beforeAll(async () => {
    await mongoDbHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    const accountCollection = mongoHelper.client.db().collection('accounts')
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
        email: 'any_email',
        password: 'any_password',
        confirmPassword: 'any_password'
      })
      .expect(200)
  })
})
