import { HttpRequest, HttpResponse } from '../protocols/http'

export class SingUpController {
  handle = (httpRequest: HttpRequest): HttpResponse => {
    if (httpRequest.body.name === undefined) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }

    return {
      statusCode: 400,
      body: new Error('Missing param: email')
    }
  }
}
