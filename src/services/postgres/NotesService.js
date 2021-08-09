/* eslint-disable no-underscore-dangle */
/* Create class NotesService
*  Create a constructor
*  Initialize the this._pool property with an instance of package pg. Pool.
*  Create addNote functions with title, body, and tags parameters
*/
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapDBToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class NotesService {
  constructor() {
    this._pool = new Pool();
  }

  /* Create addNote function
  * Create query object to insert new notes into database
  * Execution of a already created query, with the function this._pool.query
  * Add async to addNote and await to query call
  * Evaluation of the values of results.rows.id
  * Return the function with the value id. Otherwise throw An InvariantError.
  */
  async addNote({ title, body, tags }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, title, body, tags, createdAt, updatedAt],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  /* Create getNotes function
  *  Get all data notes in the database with query
  *  Create a function named mapDBToModel and accept the object note parameter from the database
  *  Restore mapDBToModel function with new note object
  */
  async getNotes() {
    const result = await this._pool.query('SELECT * FROM notes');
    return result.rows.map(mapDBToModel);
  }

  /* Create async getNoteById
  * Query to get notes in the database based on the given id
  * Check the result.rows value, if the value is 0 (false) then raise NotFoundError
  * Returned with result.rows already mapped with mapDBToModel function
  */
  async getNoteById(id) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel)[0];
  }

  /* Create editNoteByid function
  * Query to change notes in database based on given id
  * Check the result.rows value, if the value is 0 (false) then raise NotFoundError
  */
  async editNoteById(id, { title, body, tags }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
      values: [title, body, tags, updatedAt, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }

  /* Create deleteNoteById
  * In it do a query to delete notes in the database based on id
  * Check result.rows value if the value is 0 (false) then raise NotFoundError
  */
  async deleteNoteById(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = NotesService;
