import { EmailValidator } from "../presentation/protocols/email-validator"
import { EmailValidatorAdapter } from "./email-validator-adapter"
import validator from "validator"

jest.mock('validator', () => ({
    isEmail (): boolean {
        return true
    }
}))

const makeSut = (): EmailValidator => {
    return new EmailValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
    test('should return false if validator return false', () => {
        const sut = makeSut()
        jest.spyOn(sut, 'isValid').mockReturnValueOnce(false)
        const isValid = sut.isValid('invalid_email@provider.com')
        expect(isValid).toBe(false)
    })

    test('should return true if validator return true', () => {
        const sut = makeSut()
        const isValid = sut.isValid('valid_email@provider.com')
        expect(isValid).toBe(true)
    })

    test('should call isEmail with the correct input', () => {
        const sut = makeSut()
        const isEmailSpy = jest.spyOn(validator, 'isEmail')
        sut.isValid('any_email@provider.com')
        expect(isEmailSpy).toHaveBeenCalledWith('any_email@provider.com')
    })
})