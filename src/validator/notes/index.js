/* Create an object named NotesValidator
* Create a validateNotePayload property
* Provide its value with an empty function that has one payload parameter
* Validation of Joi in validating the payload inside the function
* Generate an error by bringing a message from the validationResult.error.message property
*/

const InvariantError = require('../../exceptions/InvariantError');
const { NotePayloadSchema } = require('./schema');

const NotesValidator = {
  validateNotePayload: (payload) => {
    const validationResult = NotePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = NotesValidator;
