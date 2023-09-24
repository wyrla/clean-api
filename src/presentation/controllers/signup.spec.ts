import { MissingParamError } from '../errors/missing-param-error'
import { SignUpController } from './signup'

const makeSut = (): SignUpController => {
  return new SignUpController()
}

describe('SignUpController', () => {
  it('should return 400 if name was not provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        email: 'some_email@provider.com',
        password: 'some_password',
        confirmPassword: 'some_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('should return 400 if email was not provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'some_name',
        password: 'some_password',
        confirmPassword: 'some_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: email'))
  })

  it('should return 400 if password was not provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'some_name',
        email: 'some_email@provider',
        confirmPassword: 'some_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: password'))
  })

  it('should return 400 if confirmPassword was not provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'some_name',
        password: 'some_password',
        email: 'some_email@provider'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: confirmPassword'))
  })
})
