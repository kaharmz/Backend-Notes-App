/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Create new user
  pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_notes', 'old_notes', 'old_notes', 'old_notes')");
  // Change the owner value on a note whose owner is NULL
  pgm.sql("UPDATE notes SET owner = 'old_notes' WHERE owner = NULL");
  // Provides constraint foreign key to the owner against the id column of the users table
  pgm.addConstraint('notes', 'fk_notes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // Remove constraints fk_notes.owner_users.id in the notes table
  pgm.dropConstraint('notes', 'fk_notes.owner_user.id');
  // Changes the owner value old_notes on the note to NULL
  pgm.sql("UPDATE notes SET owner = NULL WHERE owner = 'old_notes'");
  // Remove a new user.
  pgm.sql("DELETE FROM users WHERE id = 'old_notes'");
};
