
module.exports = {
    "development": {
        "storage": "./dev.sqlite3",
        "dialect": "sqlite"
    },
    "test": {
        "storage": "./dev.sqlite3",
        "dialect": "sqlite"
    },
    "production": {
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_DATABASE,
        "host": process.env.DB_HOST,
        "dialect": process.env.DB_DIALECT,
        "dialectOptions": {
            "useUTC": false
        },
        "timezone": "+07:00"
    }
}
