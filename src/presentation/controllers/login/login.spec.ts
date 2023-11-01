import { type Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { type EmailValidator } from '../signup/signup-protocols'
import { LoginController } from './login'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return await new Promise(resolve => { resolve('any_token') })
    }
  }
  return new AuthenticationStub()
}

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: { password: 'valid_password' }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: { email: 'valid_email' }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call EmailValidator with the correct input', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const emailValidatorSpyOn = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        email: 'valid_email',
        password: 'valid_password'
      }
    }
    await sut.handle(httpRequest)
    expect(emailValidatorSpyOn).toHaveBeenCalledWith('valid_email')
  })

  test('Should return 400 if email is invalid', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce((email) => false)
    const httpRequest = {
      body: {
        email: 'invalid_email',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 400 if email emailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = {
      body: {
        email: 'invalid_email',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authentication with the correct input', async () => {
    const { sut, authenticationStub } = makeSut()
    const authStub = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = {
      body: {
        email: 'valid_email',
        password: 'valid_password'
      }
    }
    await sut.handle(httpRequest)
    expect(authStub).toHaveBeenCalledWith('valid_email', 'valid_password')
  })
})
