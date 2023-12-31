import type { Authentication, Controller, EmailValidator, HttpRequest, HttpResponse } from './login-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body

      if (!this.emailValidator.isValid(email)) return badRequest(new InvalidParamError('email'))

      const accessToken = await this.authentication.auth(email, password)

      if (!accessToken) return unauthorized()

      return ok({
        accessToken
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
