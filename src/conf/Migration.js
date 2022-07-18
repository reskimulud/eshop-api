const migration = require('mysql-migrations');
const Database = require('./Database');

const database = new Database();

migration.init(database.connection, __dirname + '/migrations');
