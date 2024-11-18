"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
require('dotenv').config();
const pool = new pg_1.Pool({
    user: process.env.DBUser,
    host: process.env.DBHost,
    database: process.env.database,
    password: process.env.DBPassword,
    port: Number(process.env.DBPort),
});
exports.default = pool;
