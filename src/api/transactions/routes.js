const routes = (handler) => [
  {
    method: 'POST',
    path: '/checkout',
    handler: handler.postCheckout,
    options: {
      auth: 'eshop_jwt',
    },
  },
  {
    method: 'GET',
    path: '/transactions',
    handler: handler.getTransactions,
    options: {
      auth: 'eshop_jwt',
    },
  },
  {
    method: 'GET',
    path: '/transactions/{id}',
    handler: handler.getTransactionById,
    options: {
      auth: 'eshop_jwt',
    },
  },
];

module.exports = routes;
