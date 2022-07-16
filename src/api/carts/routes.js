const routes = (handler) => [
  {
    method: 'POST',
    path: '/carts/{userId}',
    handler: handler.postCart,
  },
  {
    method: 'GET',
    path: '/carts/{userId}',
    handler: handler.getCartByUserId,
  },
];

module.exports = routes;
