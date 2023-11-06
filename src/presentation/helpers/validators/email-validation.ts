import { InvalidParamError } from '../../errors'
import { type EmailValidator } from '../../protocols/email-validator'
import { type Validation } from './validation'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: unknown): Error {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
