require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

// authentication
const authentication = require('./api/authentication');
const Database = require('./conf/Database');
const ClientError = require('./exceptions/ClientError');
const AuthenticationService = require('./services/mysql/AuthenticationService');
const AuthenticationValidator = require('./validator/authentication');

// products
const products = require('./api/products');
const ProductsService = require('./services/mysql/ProductsService');

const StorageService = require('./services/storage/StorageService');
const path = require('path');
const ProductsValidator = require('./validator/products');

const init = async () => {
  const database = new Database();
  const authenticationService = new AuthenticationService(database);
  const productsService = new ProductsService(database);
  const storageService = new StorageService(path.resolve(__dirname, '/api/products/images'));

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
    {
      plugin: Inert,
    },
  ]);

  // defines authentication strategy
  server.auth.strategy('eshop_jwt', 'jwt', {
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

  // defines internal plugins
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
        productsService,
        storageService,
        validator: ProductsValidator,
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

init();