import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { type Controller, type HttpRequest, type HttpResponse } from '../../protocols'
import { type EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      if (!body.email) return badRequest(new MissingParamError('email'))
      if (!body.password) return badRequest(new MissingParamError('password'))

      if (!this.emailValidator.isValid(body.email)) return badRequest(new InvalidParamError('email'))
    } catch (error) {
      return serverError(error)
    }
  }
}