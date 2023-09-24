import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'
import { Encrypter } from '../../data/protocols/encrypter'

jest.mock('bcrypt', () => ({
    async hash (): Promise<string> {
        return 'hashed_password'
    }
}))

const salt = 12
const makeSut = (): Encrypter => {
    return new BCryptAdapter(salt)
}

describe('BCrypt Adapter', () => {
    test('should call bcrypt with correct input', async () => {
        const sut = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('valid_password')
        expect(hashSpy).toBeCalledWith('valid_password', salt)
    })

    test('should return a hash on success', async () => {
        const sut = makeSut()
        const hashedPassword = await sut.encrypt('valid_password')
        expect(hashedPassword).toBe('hashed_password')
    })
})
