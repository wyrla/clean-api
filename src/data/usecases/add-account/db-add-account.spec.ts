import { Encrypter } from "../../protocols/encrypter"
import { DbAddAccount } from "./db-add-account"

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncrypterStub()
}

interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const sut = new DbAddAccount(encrypterStub)
    return {
        sut,
        encrypterStub
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
})