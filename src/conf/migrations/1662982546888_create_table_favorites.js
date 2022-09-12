module.exports = {
    "up": `CREATE TABLE favorites (
            id VARCHAR(50) NOT NULL,
            productId VARCHAR(50) NOT NULL,
            userId VARCHAR(50) NOT NULL,
            PRIMARY KEY (id))`,
    "down": "DROP TABLE favorites"
}