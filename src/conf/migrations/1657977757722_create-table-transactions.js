module.exports = {
    "up": `CREATE TABLE transactions (
        id VARCHAR(50) NOT NULL,
        userId VARCHAR(50) NOT NULL,
        dateCreated TEXT NOT NULL,
        PRIMARY KEY (id)
    )`,
    "down": "DROP TABLE transactions"
}