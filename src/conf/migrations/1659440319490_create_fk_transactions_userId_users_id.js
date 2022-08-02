module.exports = {
    "up": `ALTER TABLE transactions
            ADD CONSTRAINT \`fk_transactions.userId_users.id\`
            FOREIGN KEY (userId)
            REFERENCES users(id)
            ON DELETE CASCADE ON UPDATE RESTRICT`,
    "down": ""
}