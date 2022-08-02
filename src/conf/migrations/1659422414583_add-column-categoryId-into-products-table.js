module.exports = {
    "up": "ALTER TABLE products ADD categoryId VARCHAR(50) NOT NULL AFTER price",
    "down": "ALTER TABLE products DROP categoryId"
}