module.exports = {
    "up": "ALTER TABLE transactions CHANGE dateCreated dateCreated BIGINT(32) NOT NULL;",
    "down": ""
}