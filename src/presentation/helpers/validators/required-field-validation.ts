import { MissingParamError } from '../../errors'
import { type Validation } from './validation'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: unknown): Error {
    if (!input[this.fieldName]) return new MissingParamError(this.fieldName)
  }
}
