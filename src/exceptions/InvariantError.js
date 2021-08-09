/* Create a class named InvariantError that inherits the ClientError class
* Create a constructor that accepts one parameter named message
* Call the super function by bringing the message value
* Set the this.name with the value "InvariantError"
*/

const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
