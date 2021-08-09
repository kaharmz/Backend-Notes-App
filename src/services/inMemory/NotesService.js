/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

// Create a NotesService class that has a property this._notes as an array.
class NotesService {
  constructor() {
    this._notes = [];
  }

  /* Create addNote method that accepts note object parameters title, body, tags
  * Create object newNote with property title, tags, body, id, createdAt, updateAt
  * Use the push function to insert newNote into the this._notes
  * Use the filter function to search by record id you've just created
  * Store the result in the isSuccess variable.
  * Use conditions in the isSuccess variable.
  * If false, make the addNotes function generate an Error. Instead (if true),
  * return the function with the new record id value.
  */
  addNote({ title, body, tags }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const newNote = {
      title, tags, body, id, createdAt, updatedAt,
    };
    this._notes.push(newNote);
    const isSuccess = this._notes.filter((note) => note.id === id).length > 0;
    if (!isSuccess) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }
    return id;
  }

  // Getnote
  getNotes() {
    return this._notes;
  }

  /* Create a getNoteById method with one id parameter to read notes stored based on the given id.
  * Get note based on id, we can take advantage of filter function.
  * Use conditions in note variables. If note is not found, raise Error.
  * Return the function with the value of note.
  */
  getNoteById(id) {
    const note = this._notes.filter((n) => n.id === id)[0];
    if (!note) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }
    return note;
  }

  /* Create editNoteById function to change saved notes data with two parameter
  * This function accepts two parameters namely id and the latest note
    data in the form of objects (payload that will be taken partly field namely title, body, tags).
  * Write logic in updating record data on an array of this._notes
  */
  editNoteById(id, { title, body, tags }) {
    const index = this._notes.findIndex((note) => note.id === id);
    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
    const updatedAt = new Date().toISOString();
    this._notes[index] = {
      ...this._notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
  }

  /* Create deleteNoteById function to delete notes saved by id
  * Remove note from this._notes array based on given id
  * Use the error function when a note with the given id is not found.
  */
  deleteNoteById(id) {
    const index = this._notes.findIndex((note) => note.id === id);
    if (index === -1) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
    this._notes.splice(index, 1);
  }
}

module.exports = NotesService;
