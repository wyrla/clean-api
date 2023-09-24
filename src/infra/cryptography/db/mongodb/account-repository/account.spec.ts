import { MongoHelper } from "../helpers/mongo-helper"
import { AccountMongoRepository } from "./account"

describe('Account Mongo Repository', () => {
    const mongoHelper = new MongoHelper()

    beforeAll(async () => {
        await mongoHelper.connect(process.env.MONGO_URL!)
    })


    afterAll(async () => {
        await mongoHelper.disconnect()
    })

    test('should return an account on success', async () => {
        const sut = new AccountMongoRepository()
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