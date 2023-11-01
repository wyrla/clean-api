import { type Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { type Controller, type HttpRequest, type HttpResponse } from '../../protocols'
import { type EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      if (!email) return badRequest(new MissingParamError('email'))
      if (!password) return badRequest(new MissingParamError('password'))

      if (!this.emailValidator.isValid(email)) return badRequest(new InvalidParamError('email'))

      await this.authentication.auth(email, password)
    } catch (error) {
      return serverError(error)
    }
  }
}
