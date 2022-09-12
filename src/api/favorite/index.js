const FavoritesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'favorites',
  version: '1.0.0',
  register: async (server, { service }) => {
    const handler = new FavoritesHandler(service);
    server.route(routes(handler));
  },
};
