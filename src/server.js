require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Database = require('./conf/Database');
const ClientError = require('./exceptions/ClientError');
const Jwt = require('@hapi/jwt');
const path = require('path');
const Inert = require('@hapi/inert');

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

// transactions
const transactions = require('./api/transactions');
const TransactionsService = require('./services/mysql/TransactionsService');

// storage
const StorageService = require('./services/storage/StorageService');

// favorites
const FavoritesService = require('./services/mysql/FavoritesService');
const favorite = require('./api/favorite');
const FavoritesValidator = require('./validator/favorites');

const init = async () => {

  const database = new Database()
  const authenticationService = new AuthenticationService(database);
  const productsService = new ProductsService(database);
  const cartsService = new CartsService(database);
  const transactionsService = new TransactionsService(database);
  const storageService = new StorageService(path.resolve(__dirname, 'api/products/images'));
  const favoriteService = new FavoritesService(database);

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
        productsService,
        storageService,
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
    {
      plugin: transactions,
      options: {
        service: transactionsService,
      },
      plugin: favorite,
      options: {
        service: favoriteService,
        validator: FavoritesValidator,
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
