require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Database = require('./conf/Database');
const ClientError = require('./exceptions/ClientError');
const Jwt = require('@hapi/jwt');

// authentication
const authentication = require('./api/authentication');
const AuthenticationService = require('./services/mysql/AuthenticationsService');
const AuthenticationValidator = require('./validator/authentication');

// products
const products = require('./api/products');
const ProductsService = require('./services/mysql/ProductsService');
const ProductsValidator = require('./validator/products');

// carts
const carts = require('./api/carts');
const CartsService = require('./services/mysql/CartsService');
const CartsValidator = require('./validator/carts');

const init = async () => {

  const database = new Database()
  const authenticationService = new AuthenticationService(database);
  const productsService = new ProductsService(database);
  const cartsService = new CartsService(database);

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: () => ({
      name: 'Rski Mulud Muchamad',
    }),
  });

  // register external plugin
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // defines authentication strategy
  server.auth.strategy('eshop_jwt', 'jwt',{
    keys: process.env.TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  //  register internal plugin
  await server.register([
    {
      plugin: authentication,
      options: {
        service: authenticationService,
        validator: AuthenticationValidator,
      },
    },
    {
      plugin: products,
      options: {
        service: productsService,
        validator: ProductsValidator,
      }
    },
    {
      plugin: carts,
      options: {
        service: cartsService,
        validator: CartsValidator,
      },
    },
  ]);

  // extension
  server.ext('onPreResponse', (request, h) => {
    const {response} = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    console.log(response);

    return h.continue;
  });

  await server.start();
  console.log(`Server running at ${server.info.uri}`);

};

init()
