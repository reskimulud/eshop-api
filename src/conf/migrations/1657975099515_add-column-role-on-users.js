module.exports = {
    "up": "ALTER TABLE users ADD role TEXT(5) NOT NULL AFTER password",
    "down": ""
}