const { Pool } = require('pg')

const config = {
    user: 'postgres',        
    host: 'localhost',       
    password: 'm1nl72oy1',    
    port: 5432               
}
const pool = new Pool(config)

async function createDatabase() {
    
    let client;

    try {
        
        //Создание базы данных
        console.log('CONNECTING TO POSTGRESQL')
        client = await pool.connect()
        await client.query(`DROP DATABASE IF EXISTS "NodeJSTask1";`)
        await client.query('CREATE DATABASE "NodeJSTask1";')
        await client.end()
        
        // Новый конфиг с информацией о базе данных
        const newConfig = {
            ...config,
            database: 'NodeJSTask1'
        }
        const newPool = new Pool(newConfig)

        console.log('CONNECTING TO DATABASE')
        client = await newPool.connect()

        // Таблица магазинов
        await client.query(`
            CREATE TABLE shops (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
        `)

        // Таблица продуктов
        await client.query(`
            CREATE TABLE products (
                id SERIAL PRIMARY KEY,
                plu VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL
            );
        `)

        // Таблица товаров
        await client.query(`
            CREATE TABLE stocks (
                id SERIAL PRIMARY KEY,
                product_id INT REFERENCES products(id) ON DELETE CASCADE,
                shop_id INT REFERENCES shops(id) ON DELETE CASCADE,
                quantity_in_stock INT NOT NULL CHECK (quantity_in_stock >= 0),
                quantity_in_order INT NOT NULL CHECK (quantity_in_order >= 0),
                UNIQUE (product_id, shop_id)
            );
        `)

        // Таблица действий с товарами
        await client.query(`
            CREATE TABLE actions (
                id SERIAL PRIMARY KEY,
                product_id INT REFERENCES products(id) ON DELETE CASCADE,
                shop_id INT REFERENCES shops(id) ON DELETE CASCADE,
                action_type VARCHAR(255) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                quantity INT,
                previous_stock INT,
                current_stock INT,
                previous_order INT,
                current_order INT
            );
        `)
        await client.end()
        console.log('All CREATED SUCCESSFULLY')

    } catch (error) {
        console.error('ERROR CREATING DATABASE OR TABLES:', error.message)
    }
}

createDatabase()