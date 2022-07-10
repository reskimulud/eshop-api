class PoolMySql {
  #pool;

  constructor() {
    this.#pool = mysql.createPool({
      connectionLimit: 10,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  query(query) {
    return new Promise((resolve, reject) => {
      this.#pool.query(query, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result);
      });
    });
  }
}

module.exports = PoolMySql;