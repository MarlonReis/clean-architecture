export class SingUpController {
  handle = (httpRequest: any): any => {
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
