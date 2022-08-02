module.exports = {
    "up": `ALTER TABLE orders
            ADD CONSTRAINT \`fk_orders.userId_users.id\`
            FOREIGN KEY (userId)
            REFERENCES users(id)
            ON DELETE CASCADE ON UPDATE RESTRICT`,
    "down": ""
}