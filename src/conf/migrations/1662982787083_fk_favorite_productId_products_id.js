module.exports = {
    "up": `ALTER TABLE favorites
            ADD CONSTRAINT \`fk_favorites.productId_products.id\`
            FOREIGN KEY (productId)
            REFERENCES products(id)
            ON DELETE CASCADE ON UPDATE RESTRICT`,
    "down": ""
}