module.exports = {
    "up": `CREATE TABLE orders (
        id VARCHAR(50) NOT NULL,
        productId VARCHAR(50) NOT NULL,
        userId VARCHAR(50),
        transactionId VARCHAR(50) NOT NULL,
        quantity INTEGER NOT NULL,
        PRIMARY KEY (id)
    )`,
    "down": "DRAP TABLE orders"
}