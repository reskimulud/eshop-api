const routes = (handler) => [
  {
    method: 'POST',
    path: '/register',
    handler: handler.postRegister,
  },
  {
    method: 'POST',
    path: '/login',
    handler: handler.postLogin,
  },
  {
    method: 'GET',
    path: '/user',
    handler: handler.getUser,
    options: {
      auth: 'eshop_jwt',
    },
  },
];

module.exports = routes;
