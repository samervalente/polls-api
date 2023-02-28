import { SignupController } from "./signup"

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', () => {
        const sut = new SignupController()
        const httpRequest = {
            body:{
                email:'faker_email@mail.com',
                password:'faker_password',
                passwordConfirmation:'faker_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
    })
})