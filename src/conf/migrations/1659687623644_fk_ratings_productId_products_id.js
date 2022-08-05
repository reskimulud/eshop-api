module.exports = {
    "up": `ALTER TABLE ratings
            ADD CONSTRAINT \`fk_ratings.productId_products.id\`
            FOREIGN KEY (productId)
            REFERENCES products(id)
            ON DELETE CASCADE ON UPDATE RESTRICT`,
    "down": ""
}