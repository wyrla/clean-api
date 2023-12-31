import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required Field Validation', () => {
  test('Should return a missing param error if validation fails', () => {
    const sut = new RequiredFieldValidation('any_field')
    const error = sut.validate({ password: 'any_password' })
    expect(error).toEqual(new MissingParamError('any_field'))
  })

  test('Should not return if validation succeed', () => {
    const sut = new RequiredFieldValidation('any_field')
    const error = sut.validate({ any_field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
