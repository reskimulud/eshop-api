module.exports = {
    "up": `CREATE TABLE carts (
            id VARCHAR(50) NOT NULL,
            userId VARCHAR(50) NOT NULL,
            productId VARCHAR(50) NOT NULL,
            quantity INTEGER NOT NULL,
            PRIMARY KEY (id))`,
    "down": "DROP TABLE carts"
}