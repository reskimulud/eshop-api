const Jwt = require('@hapi/jwt');

class AuthenticationHandler {
  #service;
  #validator;
  
  constructor(service, validator) {
    this.#service = service;
    this.#validator = validator;

    this.postRegister = this.postRegister.bind(this);
    this.postLogin = this.postLogin.bind(this);
  }

  #generateToken(payload) {
    return Jwt.token.generate(payload, process.env.TOKEN_KEY)
  }

  async postRegister(request, h) {
    await this.#validator.validateRegisterPayload(request.payload);
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
    await this.#validator.validateLoginPayload(request.payload);
    const { email, password } = request.payload;

    const id = await this.#service.login(email, password)

    const payloadToken = { id, email };
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
}

module.exports = AuthenticationHandler;
