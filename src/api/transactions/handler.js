class TransactionsHandler {
  #service;

  constructor(service) {
    this.#service = service;

    this.postCheckout = this.postCheckout.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
    this.getTransactionById = this.getTransactionById.bind(this);
  }

  async postCheckout(request, h) {
    const { id: userId } = request.auth.credentials;

    const transactionId = await this.#service.addCheckout(userId);

    const response = h.response({
      status: 'success',
      message: 'Transaksi berhasil',
      data: {
        transactionId,
      },
    });
    response.code(201);
    return response;
  }

  async getTransactions(request, h) {
    const { id: userId } = request.auth.credentials;
    const transactions = await this.#service.getTransactionsByUserId(userId);

    return {
      status: 'success',
      message: 'Data transaksi berhasil diambil',
      data: {
        transactions,
      },
    };
  }

  async getTransactionById(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id } = request.params;

    const { transaction, orders } = await this.#service.getTransactionById(userId, id);
    let total = 0;
    let totalItem = 0;

    orders.forEach((order) => {
      total += (order.price * order.quantity);
      totalItem += order.quantity;
    });

    return {
      status: 'success',
      message: 'Data transaksi berhasil diambil',
      data: {
		id,
        userId,
        dateCreated: transaction.dateCreated,
        totalItem,
        total,
        orders,
      },
    };
  }
}

module.exports = TransactionsHandler;
