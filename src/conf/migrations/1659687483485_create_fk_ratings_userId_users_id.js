module.exports = {
    "up": `ALTER TABLE ratings
            ADD CONSTRAINT \`fk_rating.userId_users.id\`
            FOREIGN KEY (userId)
            REFERENCES users(id)
            ON DELETE CASCADE ON UPDATE RESTRICT`,
    "down": ""
}