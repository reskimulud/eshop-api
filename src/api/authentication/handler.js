class AuthenticationHandler {
  #service;
  #validator;

  constructor(service, validator) {
    this.#service = service;
    this.#validator = validator;

    this.postRegister = this.postRegister.bind(this);
    this.postLogin = this.postLogin.bind(this);
    this.getUser = this.getUser.bind(this);
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

    const { id } = await this.#service.login(email, password)

    return {
      status: 'success',
      message: 'User berhasil login',
      data: {
        id,
      },
    };
  }

  async getUser(request, h) {
    const { id } = request.params;
    const user = await this.#service.getUserById(id);

    return {
      status: 'success',
      message: 'Data user berhasil diambil',
      data: {
        user,
      },
    };
  }
}

module.exports = AuthenticationHandler;
