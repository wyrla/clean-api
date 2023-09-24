import { DbAddAccount } from './db-add-account'
import { type AccountModel, type AddAccountModel, type AddAccountRepository, type Encrypter } from './db-add-account-protocols'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeInput = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@provider.com',
        password: 'hashed_password'
      }
      return await new Promise(resolve => { resolve(fakeInput) })
    }
  }
  return new AddAccountRepositoryStub()
}

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub

  }
}

describe('DbAddAccount Usecase', () => {
  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const fakeInput = {
      name: 'valid_name',
      email: 'valid_email@provider.com',
      password: 'valid_password'
    }
    await sut.add(fakeInput)
    expect(encryptSpy).toBeCalledWith('valid_password')
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const fakeInput = {
      name: 'valid_name',
      email: 'valid_email@provider.com',
      password: 'valid_password'
    }
    const promise = sut.add(fakeInput)
    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct input', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const fakeInput = {
      name: 'valid_name',
      email: 'valid_email@provider.com',
      password: 'valid_password'
    }
    await sut.add(fakeInput)
    expect(addSpy).toBeCalledWith({
      name: 'valid_name',
      email: 'valid_email@provider.com',
      password: 'hashed_password'
    })
  })

  test('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const fakeInput = {
      name: 'valid_name',
      email: 'valid_email@provider.com',
      password: 'valid_password'
    }
    const promise = sut.add(fakeInput)
    await expect(promise).rejects.toThrow()
  })

  test('should return an account on succeed', async () => {
    const { sut } = makeSut()
    const fakeInput = {
      name: 'valid_name',
      email: 'valid_email@provider.com',
      password: 'valid_password'
    }
    const account = await sut.add(fakeInput)
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@provider.com',
      password: 'hashed_password'
    })
  })
})
