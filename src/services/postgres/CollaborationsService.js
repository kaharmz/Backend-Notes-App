/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

/*
Create CollaborationsService classes and constructors
initialize properties this._pool with instance values pg. Pool.
*/
class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  /* Create a new asynchronous function
     under the addCollaboration name that accepts two parameters: noteId and userId.
     * Queri to enter collaboration id, noteId, and userId values
       in the collaborations table. For id values
       use nanoids to create unique IDs and add "collab-"
       prefixes so as not to be biased with id notes or users values.
     * Check the result.rows.length value.
       If the value is zero,
       then throw InvariantError with the message "Collaboration failed to add".
       If not, then restore the addCollaboration function with the result.rows.id value.
  */
  async addCollaboration(noteId, userId) {
    const id = `collab-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, noteId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  /*
  Create a new asynchronous function
  under the name deleteCollaboration that accepts two parameters namely, noteId and userId.
  * Query to remove collaboration values--on the collaborations table--based noteId and userId
    given in parameters
  * Then we check the result.rows.length value.
    If the value is zero,
    then throw InvariantError with the message "Collaboration failed to be deleted".
  */
  async deleteCollaboration(noteId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE note_id = $1 AND user_id = $2 RETURNING id',
      values: [noteId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
  }

  /*
  Create a new asynchronous function
  under the name verifyCollaborator that accepts noteId and userId as parameters.
  * Queries to ensure collaboration with noteId and userId
    are provided in parameters in the database.
  * Check the result.rows.length value
    When the value is zero, throw InvariantError because the collaboration is invalid.
  */
  async verifyCollaborator(noteId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE note_id = $1 AND user_id = $2',
      values: [noteId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = CollaborationsService;
