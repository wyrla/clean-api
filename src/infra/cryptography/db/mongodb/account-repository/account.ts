import { AddAccountRepository } from "../../../../../data/protocols/add-account-repository";
import { AccountModel } from "../../../../../domain/models/account";
import { AddAccountModel } from "../../../../../domain/usecases/add-account";

export class AccountMongoRepository implements AddAccountRepository {
    add(account: AddAccountModel): Promise<AccountModel> {
        return new Promise((resolve) => resolve({ email: account.email, id: '1', name: account.name, password: account.password}))
    }
}