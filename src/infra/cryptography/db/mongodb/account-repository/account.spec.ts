import { MongoHelper } from "../helpers/mongo-helper"

describe('Account Mongo Repository', () => {
    const mongoHelper = new MongoHelper()

    beforeAll(async () => {
        await mongoHelper.connect(process.env.MONGO_URL!)
    })


    afterAll(async () => {
        await mongoHelper.disconnect()
    })
})