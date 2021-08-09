/*
* Import NotesHandler can be used.
* Create object plugin
* Give two properties name and notes
* And create register function with two parameters server and service.
* Create an instance of the NotesHandler class Then the value of the service as in its constructor
* Call the routes function and give notesHandler its handler value.
* add the validator property to the options parameter
* in the register function and use the validator as an argument in creating NoteHandler
*/

const NotesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'notes',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const notesHandler = new NotesHandler(service, validator);
    server.route(routes(notesHandler));
  },
};
