/* eslint-disable no-underscore-dangle */
/* eslint-disable lines-between-class-members */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }
  /* Create operation functions in managing user data
  *  Create a new asynchronous function
  *  Named addUser that accepts user object parameters (username, password, fullname)
  *  Verify your username, make sure it's not registered yet.
  *  If the verification passes, then enter a new user into the database
  *  Query to insert a user into the database
  *  Generate InvariantError with message "User failed to add" message
  */
  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  /* Create a new asynchronous function
   * Named verifyNewUsername and accept a single string parameter named username
   * Query username from users table based on username value
  */
  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }

  /* Create function named getUserById that accepts a single parameter of the userId string
  * Query to get id, username, and fullname from users table based on userId parameter
  * Evaluation of result.rows.length value
  * Return getUserById function with user value obtained
  */
  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }
    return result.rows[0];
  }

  /* Create verifyUserCredential function that accepts two string parameters: username and password
  * Query to obtain id and password from user table based on username submitted through parameters
  * Use AuthenticationError that has been created when the result.rows.length value is empty
  * If the result.rows.length is not empty, get the id and password from result.rows
  * Compare hashedPassword values with passwords in parameters
  * If the result is false, raise the AuthenticationError error
  * If the result is true, return it with a user id value
  */
  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }
    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }
    return id;
  }
}

module.exports = UsersService;
