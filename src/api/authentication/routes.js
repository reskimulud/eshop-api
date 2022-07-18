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
    path: '/user/{id}',
    handler: handler.getUser,
  },
];

module.exports = routes;
