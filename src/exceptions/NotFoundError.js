/* Create a NotFoundError class that inherits ClientError
 * Create a constructor that accepts a parameter named message
 * Call the super function with the message value and 404 as statusCode
 * Set this.name with NotFoundError value
*/

const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
