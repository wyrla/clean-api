import type { AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse, Validation } from './signup-protocols'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { InvalidParamError } from '../../errors'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { confirmPassword, email, name, password } = httpRequest.body
      if (password !== confirmPassword) {
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
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
