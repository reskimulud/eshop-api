const FavoritesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'favorites',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const handler = new FavoritesHandler(service, validator);
    server.route(routes(handler));
  },
};
