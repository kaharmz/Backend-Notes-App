/* eslint-disable no-underscore-dangle */
/* Create class AuthenticationsService and Constructor
* Initialized this._pool with value pg.Pool
*/

const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  /* Create an addRefreshToken function that accepts one string parameter: a token
  *  Query to enter tokens (parameters) into the authentications table
  */
  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };
    await this._pool.query(query);
  }

  /* Create an asynchronous verifyRefreshToken function that accepts one parameter 'token'
  * Query get a token refresh based on the token carried by the parameter
  * Check the result.rows.length value
    if the value is less than 1 it means that the verified token is not valid
    Then awaken InvariantError with the message "Refresh invalid token"
  */
  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT FROM authentications WHERE token = $1',
      values: [token],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  /* Create an asynchronous deleteRefreshToken function that accepts one parameter 'token'
  * Call the verifyRefreshToken function.
    If verification fails, the function will generate InvariantError
  * Query data to remove refresh tokens on authentications table by token
  */
  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };
    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
