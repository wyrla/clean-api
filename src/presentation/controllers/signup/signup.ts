import type { AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse } from './signup-protocols'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'

export class SignUpController implements Controller {

  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
    ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'confirmPassword']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { confirmPassword, email, name, password } = httpRequest.body
      if(password !== confirmPassword) {
        return badRequest(new InvalidParamError('confirmPassword'))
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        email,
        name,
        password
      })

      return ok(account)
    }
    catch (error) {
      return serverError()
    }
  }
}
