const TransactionsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'transactions',
  version: '1.0.0',
  register: async (server, { service }) => {
    const handler = new TransactionsHandler(service);
    server.route(routes(handler));
  },
};
