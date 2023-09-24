import { AddAccountRepository } from "../../../../../data/protocols/add-account-repository";
import { AccountModel } from "../../../../../domain/models/account";
import { AddAccountModel } from "../../../../../domain/usecases/add-account";
import { mongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
    private accountCollection = mongoHelper.getCollection('accounts')

    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const result = await this.accountCollection.insertOne(accountData)

        const account = await this.accountCollection.findOne({_id: result.insertedId})

        return mongoHelper.map(account)
    }
  
}