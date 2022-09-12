module.exports = {
    "up": `ALTER TABLE favorites
            ADD CONSTRAINT \`fk_favorites.userId_users.id\`
            FOREIGN KEY (userId)
            REFERENCES users(id)
            ON DELETE CASCADE ON UPDATE RESTRICT`,
    "down": ""
}