/* eslint-disable no-underscore-dangle */

const ClientError = require('../../exceptions/ClientError');

/*
 Create a class under the name CollaborationsHandler
 and make its class constructor accept collaborationsService, notesService, and validator.
*/
class CollaborationsHandler {
  constructor(collaborationsService, notesService, validator) {
    this._collaborationsService = collaborationsService;
    this._notesService = notesService;
    this._validator = validator;
    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      // Validation request.payload using the function this._validator.validateCollaborationPayload.
      this._validator.validateCollaborationPayload(request.payload);
      // verify request.auth.credentials.id, noteId located in request.payload \
      const { id: credentialId } = request.auth.credentials;
      const { noteId, userId } = request.payload;
      // Call the function collaborationsService.addCollaboration by carrying noteId and userId.
      await this._notesService.verifyNoteOwner(noteId, credentialId);
      const collaborationId = await this._collaborationsService.addCollaboration(noteId, userId);
      // Hold the value on the collaborationId variable and use the value as response data.
      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
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

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { noteId, userId } = request.payload;
      await this._notesService.verifyNoteOwner(noteId, credentialId);
      await this._collaborationsService.deleteCollaboration(noteId, userId);
      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
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

module.exports = CollaborationsHandler;
