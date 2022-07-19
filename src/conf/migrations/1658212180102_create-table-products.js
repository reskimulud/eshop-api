module.exports = {
    "up": `CREATE TABLE products (
        id VARCHAR(50) NOT NULL,
        title TEXT NOT NULL,
        price INTEGER NOT NULL,
        description TEXT,
        image TEXT,
        PRIMARY KEY (id)
    )`,
    "down": "DROP TABLE products"
}