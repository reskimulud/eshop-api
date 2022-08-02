module.exports = {
    "up": `ALTER TABLE orders
            ADD CONSTRAINT \`fk_orders.transactionId_transactions.id\`
            FOREIGN KEY (transactionId)
            REFERENCES transactions(id)
            ON DELETE CASCADE ON UPDATE RESTRICT`,
    "down": ""
}