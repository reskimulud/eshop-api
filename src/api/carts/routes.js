const routes = (handler) => [
  {
    method: 'POST',
    path: '/carts/{userId}',
    handler: handler.postCart,
  },
];

module.exports = routes;
