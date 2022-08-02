module.exports = {
    "up": `ALTER TABLE products 
            ADD CONSTRAINT \`fk_products.categoryId_categories.id\`
            FOREIGN KEY (categoryId)
            REFERENCES categories(id)
            ON DELETE CASCADE ON UPDATE RESTRICT`,
    "down": ""
}