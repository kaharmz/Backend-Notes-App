/* eslint-disable no-underscore-dangle */
/* Create authenticationshandler class
* Create an authenticationsService constructor, usersService, tokenManager, and validator.
* Enter each parameter value as a private property class
*/

const ClientError = require('../../exceptions/ClientError');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsSevice = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  /* Create asynchronous handler function postAuthenticationHandler.
  * Validate payload by using validatePostAuthenticationPayload function via this._validator
  * Get username and password values from the payload
    and use those values to check if the credentials submitted on the request
  * Create access tokens and refresh tokens
    using the this._tokenManager.generateAccessToken
    and this._tokenManager.generateRefreshToken functions
  * Save refreshToken to database so that the server r
    ecognizes refreshToken if the user wants to update accessToken
  * Return requests with responses that bring accessToken and refreshToken
  * Use error handling and server error
  */

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthenticationPayload(request.payload);
      const { username, password } = request.payload;
      const id = await this._usersService.verifyUserCredential(username, password);
      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });
      await this._authenticationsSevice.addRefreshToken(refreshToken);
      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
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

  /* Create a putAuthenticationHandler function
  * Make sure payload request contains a refreshtoken property that is worth strings
    Use validatePutAuthenticationPayload function through this._validator
  * Once validated, get the RefreshToken value on request.payload
    and verify refreshToken from the database side or signature token.
  * Use error handling and server error
  */
  async putAuthenticationHandler(request, h) {
    try {
      this._validator.validatePutAuthenticationPayload(request.payload);
      const { refreshToken } = request.payload;
      await this._authenticationsSevice.verifyRefreshToken(refreshToken);
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
      const accessToken = this._tokenManager.generateAccessToken({ id });
      return {
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken,
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

  // Get a refresh ValueToken from the payload request to then remove the token from the database
  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteAuthenticationPayload(request.payload);
      const { refreshToken } = request.payload;
      await this._authenticationsSevice.verifyRefreshToken(refreshToken);
      await this._authenticationsSevice.deleteRefreshToken(refreshToken);
      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
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
}

module.exports = AuthenticationsHandler;
