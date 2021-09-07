const ExportNotesPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError')

const ExportsValidator = {
  validateExportNotesPayload: (payload) => {
    const validateResult = ExportNotesPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message)
    }
  },
};

module.exports = ExportsValidator;

