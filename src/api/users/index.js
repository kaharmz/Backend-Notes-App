const routes = require('./routes');
const UsersHandler = require('./handler');

/* Create plugin object
 * Add name, version and options plugin properties, set service and validator objects
 * Create an instance of UsersHandler and assign a service, validator of options to its constructor
 * Register user routes with the usersHandler handler on server.route
*/

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const userHandler = new UsersHandler(service, validator);
    server.route(routes(userHandler));
  },
};
