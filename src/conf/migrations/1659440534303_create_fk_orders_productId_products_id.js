module.exports = {
    "up": `ALTER TABLE orders
            ADD CONSTRAINT \`fk_orders.productId_products.id\`
            FOREIGN KEY (productId)
            REFERENCES products(id)
            ON DELETE RESTRICT ON UPDATE RESTRICT`,
    "down": ""
}