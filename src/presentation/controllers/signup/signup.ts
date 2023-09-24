import { AddAccount } from '../../../domain/usecases/add-account'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import type { Controller, EmailValidator, HttpRequest, HttpResponse } from './signup-protocols'

export class SignUpController implements Controller {

  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
    ) { }

  handle(httpRequest: HttpRequest): HttpResponse {
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

      this.addAccount.add({
        email,
        name,
        password
      })

      return {
        statusCode: 200,
        body: 'ok'
      }
    }
    catch (error) {
      return serverError()
    }
  }
}
