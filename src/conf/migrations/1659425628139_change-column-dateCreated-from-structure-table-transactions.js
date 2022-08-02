module.exports = {
    "up": "ALTER TABLE transactions CHANGE dateCreated dateCreated INT NOT NULL;",
    "down": ""
}