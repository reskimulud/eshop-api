const routes = (handler) => [
  {
    method: 'POST',
    path: '/carts',
    handler: handler.postCart,
    options: {
      auth: 'eshop_jwt',
    },
  },
  {
    method: 'GET',
    path: '/carts',
    handler: handler.getCartByUserId,
    options: {
      auth: 'eshop_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/carts/{itemId}',
    handler: handler.putCartByItemId,
    options: {
      auth: 'eshop_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/carts/{itemId}',
    handler: handler.deleteCartByItemId,
    options: {
      auth: 'eshop_jwt',
    },
  },
];

module.exports = routes;
