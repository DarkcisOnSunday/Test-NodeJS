import { Pool } from 'pg'
require('dotenv').config()

const pool = new Pool({
    user: process.env.DBUser,
    host: process.env.DBHost,
    database: process.env.database,
    password: process.env.DBPassword,
    port: Number(process.env.DBPort),
})

export default pool