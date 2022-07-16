const routes = (handler) => [
  {
    method: 'POST',
    path: '/products',
    handler: handler.postProduct,
  },
  {
    method: 'GET',
    path: '/products',
    handler: handler.getProducts,
  },
  {
    method: 'GET',
    path: '/products/{id}',
    handler: handler.getProductById,
  },
  {
    method: 'PUT',
    path: '/products/{id}',
    handler: handler.putProductById,
  },
  {
    method: 'DELETE',
    path: '/products/{id}',
    handler: handler.deleteProductById,
  },
];

module.exports = routes;
