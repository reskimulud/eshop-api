module.exports = {
    "up": `ALTER TABLE carts
            ADD CONSTRAINT \`fk_carts.userId_users.id\`
            FOREIGN KEY (userId)
            REFERENCES users(id)
            ON DELETE CASCADE ON UPDATE RESTRICT`,
    "down": ""
}