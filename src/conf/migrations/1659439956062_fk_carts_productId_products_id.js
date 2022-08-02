module.exports = {
    "up": `ALTER TABLE carts 
            ADD CONSTRAINT \`fk_carts.productId_products.id\`
            FOREIGN KEY (productId)
            REFERENCES products(id)
            ON DELETE CASCADE ON UPDATE RESTRICT`,
    "down": ""
}