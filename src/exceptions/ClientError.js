/* Create a ClientError class that inherits errors
*  Create a constructor that accepts two message and code parameters
*  For the code parameter, give the default value 400
*  Call super function by bringing message value
*  Initialization of the code value in this.code
*  Set this.name with value "ClientError"
*/

class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = ClientError;
