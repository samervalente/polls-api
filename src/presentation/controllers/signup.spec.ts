import { IHttpRequest, SignupController } from "./signup"


type RecursivePartial<T> = {
    [P in keyof T]?:
      T[P] extends (infer U)[] ? RecursivePartial<U>[] :
      T[P] extends object ? RecursivePartial<T[P]> :
      T[P];
  };

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', () => {
        const sut = new SignupController()
        const httpRequest: RecursivePartial<IHttpRequest> = {
            body:{
                email:'fake_email@mail.com',
                password:'fake_password',
                passwordConfirmation:'fake_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new Error("Missing param: name"))
    })

    test('Should return 400 if no email is provided', () => {
        const sut = new SignupController()
        const httpRequest = {
            body:{
                name:'fake name',
                password:'fake_password',
                passwordConfirmation:'fake_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new Error("Missing param: email"))
    })
})