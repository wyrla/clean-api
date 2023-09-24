import { type AddAccountRepository } from '../../../../../data/protocols/add-account-repository'
import { type AccountModel } from '../../../../../domain/models/account'
import { type AddAccountModel } from '../../../../../domain/usecases/add-account'
import { mongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  private readonly accountCollection = mongoHelper.getCollection('accounts')

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const result = await this.accountCollection.insertOne(accountData)

    const account = await this.accountCollection.findOne({ _id: result.insertedId })

    return mongoHelper.map(account)
  }
}
