import { type HttpRequest, type AccountModel, type AddAccount, type AddAccountModel, type EmailValidator } from './signup-protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { SignUpController } from './signup'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(makeFakeAccount()) })
    }
  }
  return new AddAccountStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid_email@provider',
  name: 'valid_name',
  password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'some_name',
    password: 'some_password',
    confirmPassword: 'some_password',
    email: 'some_email@provider'
  }
})

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
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

  it('should return 400 if name was not provided', async () => {
    const { sut } = makeSutStub()
    const httpRequest = {
      body: {
        email: 'some_email@provider.com',
        password: 'some_password',
        confirmPassword: 'some_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('should return 400 if email was not provided', async () => {
    const { sut } = makeSutStub()
    const httpRequest = {
      body: {
        name: 'some_name',
        password: 'some_password',
        confirmPassword: 'some_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if password was not provided', async () => {
    const { sut } = makeSutStub()
    const httpRequest = {
      body: {
        name: 'some_name',
        email: 'some_email@provider',
        confirmPassword: 'some_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should return 400 if confirmPassword was not provided', async () => {
    const { sut } = makeSutStub()
    const httpRequest = {
      body: {
        name: 'some_name',
        password: 'some_password',
        email: 'some_email@provider'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('confirmPassword'))
  })

  it('should return 400 if email is invalid', async () => {
    const { sut, emailValidatorStub } = makeSutStub()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'some_name',
        password: 'some_password',
        confirmPassword: 'some_password',
        email: 'invalid_email@provider'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('should call emailValidator with correct input', async () => {
    const { sut, emailValidatorStub } = makeSutStub()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('some_email@provider')
  })

  it('should return 500 if emailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSutStub()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error('Server error') })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('any_stack'))
  })

  it('should return 400 if confirmPassword doesn\'t match with password', async () => {
    const { sut } = makeSutStub()
    const httpRequest = {
      body: {
        name: 'some_name',
        email: 'some_email@provider',
        password: 'some_password',
        confirmPassword: 'invalid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('confirmPassword'))
  })

  it('should call addAccount use case with correct input', async () => {
    const { sut, addAccountStub } = makeSutStub()
    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addAccountSpy).toBeCalledWith({
      name: 'some_name',
      email: 'some_email@provider',
      password: 'some_password'
    })
  })

  it('should return 500 if addAccount use case throws', async () => {
    const { sut, addAccountStub } = makeSutStub()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => { reject(new Error()) })
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(null))
  })

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSutStub()
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@provider',
        password: 'valid_password',
        confirmPassword: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(makeFakeAccount())
  })
})
