/* eslint-disable camelcase */
/* Create a function named mapDBToModel and accept the object's note parameter from the database.
*/
const mapDBToModel = ({
  id,
  title,
  body,
  tags,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  body,
  tags,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapDBToModel };
