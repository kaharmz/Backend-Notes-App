/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    note_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  /*
  Add UNIQUE constraints, a combination of note_id and user_id columns.
  To avoid duplication of data between the values of the two.
  */
  pgm.addConstraint('collaborations', 'unique_note_id_and_user_id', 'UNIQUE(note_id, user_id)');
  // Provides foreign key constraints in the note_id column and user_id to notes.id and users.id
  pgm.addConstraint('collaborations', 'fk_collaborations.note_id_notes.id', 'FOREIGN KEY(note_id) REFERENCES notes(id) ON DELETE CASCADE');
  pgm.addConstraint('collaborations', 'fk_collaborations.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // Delete table colaboration
  pgm.dropTable('collaborations');
};
