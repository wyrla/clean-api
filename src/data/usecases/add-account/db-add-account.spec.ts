import { DbAddAccount } from "./db-add-account"

const makeEncrypter = () => {
    class EncrypterStub {
        async encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncrypterStub()
}

describe('DbAddAccount Usecase', () => {
    test('should call Encrypter with correct password', async () => {
        const encrypterStub = makeEncrypter()
        const sut = new DbAddAccount(encrypterStub)
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