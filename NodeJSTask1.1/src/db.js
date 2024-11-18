const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    user: process.env.DBuser,
    host: process.env.DBhost,
    database: process.env.database,
    password: process.env.DBPassword,
    port: process.env.DBPort
})

module.exports = pool