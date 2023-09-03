import { SignUpController } from './signup'

describe('SignUpController', () => {
  it('should return 400 if name was not provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'some_email@provider.com',
        password: 'some_password',
        confirmPassword: 'some_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
