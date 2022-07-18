module.exports = {
    "up": `CREATE TABLE users (
            id VARCHAR(50) NOT NULL,
            email TEXT NOT NULL,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            PRIMARY KEY (id))`,
    "down": "DROP TABLE users"
}