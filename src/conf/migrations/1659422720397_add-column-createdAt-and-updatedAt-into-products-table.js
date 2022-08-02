module.exports = {
  "up": `ALTER TABLE products
          ADD createdAt INT NOT NULL AFTER categoryId,
          ADD updatedAt INT NOT NULL AFTER createdAt`,
  "down": `ALTER TABLE products
            DROP createdAt,
            DROP updatedAt`
}