module.exports = {
    "up": `CREATE TABLE categories (
        id VARCHAR(50) NOT NULL,
        name TEXT NOT NULL,
        PRIMARY KEY (id)
    )`,
    "down": "DROP TABLE categories"
}