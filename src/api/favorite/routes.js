const routes = (handler) => [
  {
    method: 'GET',
    path: '/favorites',
    handler: handler.getFavoriteProducts,
    options: {
      auth: 'eshop_jwt',
    },
  },
  {
    method: 'POST',
    path: '/favorites',
    handler: handler.postFavoriteProduct,
    options: {
      auth: 'eshop_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/favorites/{id}',
    handler: handler.deleteFavoriteProductById,
    options: {
      auth: 'eshop_jwt',
    },
  },
];

module.exports = routes;
