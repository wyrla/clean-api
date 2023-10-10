import { type AddAccountRepository } from '../../../../../data/protocols/add-account-repository'
import { type AccountModel } from '../../../../../domain/models/account'
import { type AddAccountModel } from '../../../../../domain/usecases/add-account'
import { MongoConnection } from '../mongodb-connection'

export class AccountMongoRepository extends MongoConnection implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await this.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)

    const account = await accountCollection.findOne({ _id: result.insertedId })

    return this.map(account)
  }
}
