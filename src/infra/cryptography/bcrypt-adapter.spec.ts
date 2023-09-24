import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'
import { type Encrypter } from '../../data/protocols/encrypter'

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

  test('should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.encrypt('valid_password')
    await expect(promise).rejects.toThrow()
  })
})
