const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class AuthenticationService {
  #database;

  constructor(database) {
    this.#database = database;
  }

  async #verifyUserEmail(email) {
    const query = `SELECT email FROM users WHERE email = '${email}'`;

    const result = await this.#database.query(query);

    if (result.length > 0 || result.affectedRows > 0) {
      throw new InvariantError('Gagal menambahkan user, email telah digunakan');
    }
  }

  async register(email, name, password) {
    await this.#verifyUserEmail(email);
    const id = `user-${nanoid(16)}`;
    const hashedPasword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (id, email, name, password, role) VALUES (
      '${id}', '${email}', '${name}', '${hashedPasword}', 'user'
    )`;

    const result = await this.#database.query(query);
    console.log(result);

    if (!result || result.length < 1 || result.affectedRows < 1) {
      throw new InvariantError('Gagal menambahkan user');
    }

    return id;
  }

  async login(email, password) {
    const query = `SELECT id, email, password, role FROM users WHERE email = '${email}'`;

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows < 1) {
      throw new AuthenticationError('Email atau password salah');
    }

    const { id, password: hashedPassword, role } = result[0];

    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) {
      throw new AuthenticationError('Email atau password salah');
    }

    return { id, role };
  }

  async getUserById(userId) {
    const query = `SELECT name, email FROM users WHERE id = '${userId}'`;

    const result = await this.#database.query(query);

    if (!result || result.length < 1 || result.affectedRows < 1) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result[0];
  }

}

module.exports = AuthenticationService;
