import { InvalidParamError } from '../../errors'
import { CompareFieldValidation } from './compare-fields-validation'

describe('Compare Fields Validation', () => {
  test('Should return a invalid param error if validation fails', () => {
    const sut = new CompareFieldValidation('field', 'fieldToCompare')
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'other_value'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeed', () => {
    const sut = new CompareFieldValidation('field', 'fieldToCompare')
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    })
    expect(error).toBeFalsy()
  })
})
