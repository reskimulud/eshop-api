const Jwt = require('@hapi/jwt');

class AuthenticationHandler {
  #service;
  #validator;
  
  constructor(service, validator) {
    this.#service = service;
    this.#validator = validator;

    this.postRegister = this.postRegister.bind(this);
    this.postLogin = this.postLogin.bind(this);
    this.getUser = this.getUser.bind(this);
    this.putUserRoleById = this.putUserRoleById.bind(this);
  }

  #generateToken(payload) {
    return Jwt.token.generate(payload, process.env.TOKEN_KEY)
  }

  async postRegister(request, h) {
    this.#validator.validateRegisterPayload(request.payload);
    const { email, name, password } = request.payload;

    const id = await this.#service.register(email, name, password);

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        id,
      },
    });
    response.code(201);
    return response;
  }

  async postLogin(request, h) {
    this.#validator.validateLoginPayload(request.payload);
    const { email, password } = request.payload;

    const { id, role } = await this.#service.login(email, password)

    const payloadToken = { id, email, role };
    const token = this.#generateToken(payloadToken)

    return {
      status: 'success',
      message: 'User berhasil login',
      data: {
        id,
        token,
      },
    };
  }

  async getUser(request, h) {
    const { id: userId } = request.auth.credentials;
    const user = await this.#service.getUserById(userId);

    return {
      status: 'success',
      message: 'Data user berhasil diambil',
      data: user,
    };
  }

  async putUserRoleById(request, h) {
    const { id: credentialsId } = request.auth.credentials;
    const { id } = request.params;

    await this.#service.updateUserRoleById(credentialsId, id);

    return {
      status: 'success',
      message: 'Berhasil memperbarui role',
    };
  }
}

module.exports = AuthenticationHandler;
