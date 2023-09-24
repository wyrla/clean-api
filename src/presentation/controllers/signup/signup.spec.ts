
import { EmailValidator } from './signup-protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { SignUpController } from './signup'
import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
     return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = () =>  {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      return {
        id: 'valid_id',
        email: 'valid_email@provider',
        name: 'valid_name',
        password: 'valid_password'
      }
    } 
  }
  return new AddAccountStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator,
  addAccountStub: AddAccount
}

const makeSutStub = (): SutTypes => {
 const emailValidatorStub = makeEmailValidator()
 const addAccountStub = makeAddAccount()
 const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
} 

describe('SignUpController', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 400 if name was not provided', () => {
    const {sut} = makeSutStub()
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
    const {sut} = makeSutStub()
    const httpRequest = {
      body: {
        name: 'some_name',
        password: 'some_password',
        confirmPassword: 'some_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if password was not provided', () => {
    const {sut} = makeSutStub()
    const httpRequest = {
      body: {
        name: 'some_name',
        email: 'some_email@provider',
        confirmPassword: 'some_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should return 400 if confirmPassword was not provided', () => {
    const {sut} = makeSutStub()
    const httpRequest = {
      body: {
        name: 'some_name',
        password: 'some_password',
        email: 'some_email@provider'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('confirmPassword'))
  })


  it('should return 400 if email is invalid', () => {
    const {sut, emailValidatorStub} = makeSutStub()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'some_name',
        password: 'some_password',
        confirmPassword: 'some_password',
        email: 'invalid_email@provider'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('should call emailValidator with correct input', () => {
    const {sut, emailValidatorStub} = makeSutStub()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'some_name',
        password: 'some_password',
        confirmPassword: 'some_password',
        email: 'any_email@provider'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@provider')
  })

  it('should return 500 if emailValidator throws', () => {
    const {sut, emailValidatorStub} = makeSutStub()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error('Server error')})
    const httpRequest = {body:{
      name: 'any_name',
      email: 'any_email@provider',
      password: 'any_password',
      confirmPassword: 'any_password',
    }}
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 400 if confirmPassword doesn\'t match with password', () => {
    const { sut } = makeSutStub()
    const httpRequest = {
      body: {
        name: 'some_name',
        email: 'some_email@provider',
        password: 'some_password',
        confirmPassword: 'invalid_password',
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('confirmPassword'))
  })

  it('should call addAccount use case with correct input', () => {
    const { sut, addAccountStub } = makeSutStub()
    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'some_name',
        email: 'some_email@provider',
        password: 'some_password',
        confirmPassword: 'some_password',
      }
    }
    sut.handle(httpRequest)
    expect(addAccountSpy).toBeCalledWith({
        name: 'some_name',
        email: 'some_email@provider',
        password: 'some_password'
    })
  })

})
