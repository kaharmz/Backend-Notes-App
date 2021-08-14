/* eslint-disable no-underscore-dangle */
/* Create class UsersHandler
* Create a constructor that accepts service parameters
* Then initialize the service value and validator on the
*/

const ClientError = require('../../exceptions/ClientError');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  /* Create a postUserHandler function to handle requests
  * Validate request.payload or user object sent first
  * Get the value of that user property from request.payload
  * Call the addUser function from this._service to enter a new user
  * Return request with response code 201
  * Create handling errors to handle errors
  */
  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);
      const { username, password, fullname } = request.payload;
      const userId = await this._service.addUser({ username, password, fullname });
      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  /* Create a new handler function named getUserByIdHandler
  *  Get id (user) value from request.params
  *  Get users based on that id from the database
  *  Restore the handler function with a successful response by bringing the user as its data.
  *  Create handling errors to handle errors
  */
  async getUserByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const user = await this._service.getUserById(id);
      return {
        status: 'success',
        data: {
          user,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = UsersHandler;
