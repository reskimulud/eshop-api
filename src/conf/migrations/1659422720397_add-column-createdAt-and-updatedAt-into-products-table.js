module.exports = {
  "up": `ALTER TABLE products
          ADD createdAt BIGINT(32) NOT NULL AFTER categoryId,
          ADD updatedAt BIGINT(32) NOT NULL AFTER createdAt`,
  "down": `ALTER TABLE products
            DROP createdAt,
            DROP updatedAt`
}