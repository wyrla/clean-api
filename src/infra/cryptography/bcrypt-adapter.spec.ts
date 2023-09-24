import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

describe('BCrypt Adapter', () => {
    test('should call bcrypt with correct input', async () => {
        const salt = 12
        const sut = new BCryptAdapter(salt)
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('valid_password')
        expect(hashSpy).toBeCalledWith('valid_password', salt)
    })




})
