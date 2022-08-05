module.exports = {
    "up": `CREATE TABLE ratings (
            id VARCHAR(50) NOT NULL,
            userId VARCHAR(50) NOT NULL,
            productId VARCHAR(50) NOT NULL,
            rate INT NOT NULL,
            review TEXT,
            PRIMARY KEY (id)
    )`,
    "down": "DROP TABLE ratings"
}