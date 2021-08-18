const ClientError = require('../../exceptions/ClientError');

/* eslint-disable no-underscore-dangle */
class NotesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  /*
  * Create postNoteHandler function with request and h parameters
  * Call this._validator.validateNotePayload and provide parameters with the value request.payload
  * Get first the title, tags, and body values of the request sent by the client
  * Create a noteId variable and grab that value to respond the request.
  * Return handler function with success response that has 201 code.
  * Return handler function with failed response that has code status of 400.
  */
  async postNoteHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);
      const { title = 'untitled', body, tags } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      const noteId = await this._service.addNote({
        title, body, tags, owner: credentialId,
      });
      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          noteId,
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
      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  /*
  * Create getNotesHandler
  * get notes value from getNotes function
  */
  async getNotesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const notes = await this._service.getNotes(credentialId);
    return {
      status: 'success',
      data: {
        notes,
      },
    };
  }

  /*
  * Create getNoteByIdHandler function with request and h parameters
  * Call the function getNoteById to get the corresponding note object id
  * Return handler function with success response
  * Return handler function with failed response that has code status of 404.
  */
  async getNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      const note = await this._service.getNoteById(id, credentialId);
      return {
        status: 'success',
        data: {
          note,
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

  /*
  * Create putNoteByIdHandler function with request and h parameters
  * call this._validator.validateNotePayload and provide parameters with the value request.payload
  * Call the editNoteById function, with id as the first parameter,
    and request.payload which will provide a new note object.
  * Return handler function with success response
  * Return handler function with failed response that has code status of 404.
  */
  async putNoteByIdHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);
      const { title, body, tags } = request.payload;
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyNoteOwner(id, credentialId);
      await this._service.editNoteById(id, { title, body, tags });
      return {
        status: 'success',
        message: 'Catatan berhasil diperbarui',
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

  /*
  * Create deleteNoteByIdHandler function with request and h parameters
  * Call the function getNoteById to get the corresponding note object id
  * Return handler function with success response
  * Return handler function with failed response that has code status of 404.
  */
  async deleteNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyNoteOwner(id, credentialId);
      await this._service.deleteNoteById(id);
      return {
        status: 'success',
        message: 'Catatan berhasil dihapus',
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
      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = NotesHandler;
