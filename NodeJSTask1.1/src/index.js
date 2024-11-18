const express = require('express');
const pool = require('./db');
const axios = require('axios');

require('dotenv').config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT;

// Создание товара
app.post('/products', async (req, res) => {
    const { plu, name } = req.body
    try {
        const result = await pool.query(
            `INSERT INTO products (plu, name) VALUES ($1, $2) RETURNING *`,
            [plu, name]
        )
        res.status(200).json(result.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Создание остатка
app.post('/stocks', async (req, res) => {
    const { product_id, shop_id, quantity_in_stock, quantity_in_order } = req.body
    try {
        const result = await pool.query(
            `INSERT INTO stocks (product_id, shop_id, quantity_in_stock, quantity_in_order) VALUES ($1, $2, $3, $4) RETURNING *`,
            [product_id, shop_id, quantity_in_stock, quantity_in_order]
        )
        res.status(200).json(result.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Увеличение остатка
app.put('/stocks/:id/increase', async (req, res) => {
    const { product_id } = req.params
    const { quantity} = req.body
    try {
        const stock = await pool.query('SELECT * FROM stocks WHERE id = $1', [product_id])
        if (stock.rows.length == 0) {
            return res.status(404).json({ error: 'Stock not found' })}
        const result = await pool.query(
            `UPDATE stocks SET quantity_in_stock = quantity_in_stock + $1 WHERE id = $2 RETURNING *`,
            [quantity, product_id]
        )
    /*   
        // Отправка данных в сервис истории
        await axios.post(`${HISTORY_SERVICE_URL}/actions`, {
            product_id: stock.rows[0].product_id,
            shop_id: stock.rows[0].shop_id,
            action_type: 'increase_stock',
            quantity,
            previous_stock: stock.rows[0].quantity_in_stock,
            current_stock: result.rows[0].quantity_in_stock
        })*/

        res.status(200).json(result.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Уменьшение остатка
app.put('/stocks/:id/decrease', async (req, res) => {
    const { product_id } = req.params
    const { quantity } = req.body
    try {
        const stock = await pool.query('SELECT * FROM stocks WHERE id = $1', [product_id])
        if (stock.rows.length == 0) {
            return res.status(404).json({ error: 'Stock not found' })}
        const result = await pool.query(
            `UPDATE stocks SET quantity_in_stock = quantity_in_stock + $1 WHERE id = $2 RETURNING *`,
            [quantity, product_id]
        )
    /*   
        // Отправка данных в сервис истории
        await axios.post(`${HISTORY_SERVICE_URL}/actions`, {
            product_id: stock.rows[0].product_id,
            shop_id: stock.rows[0].shop_id,
            action_type: 'increase_stock',
            quantity,
            previous_stock: stock.rows[0].quantity_in_stock,
            current_stock: result.rows[0].quantity_in_stock
        })*/

        res.status(200).json(result.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Получение остатков по фильтрам
app.get('/stocks', async (req, res) => {
    const { plu, shop_id, stock_min, stock_max, order_min, order_max } = req.query
    let filters = []
    let values = []

    if (plu) {
        filters.push('products.id = $' + (filters.length + 1))
        values.push(plu)
    }
    if (shop_id) {
        filters.push('stocks.shop_id = $' + (filters.length + 1))
        values.push(shop_id)
    }
    if (stock_min) {
        filters.push('stocks.quantity_in_stock >= $' + (filters.length + 1))
        values.push(stock_min)
    }
    if (stock_max) {
        filters.push('stocks.quantity_in_stock <= $' + (filters.length + 1))
        values.push(stock_max)
    }
    if (order_min) {
        filters.push('stocks.quantity_in_order >= $' + (filters.length + 1))
        values.push(order_min)
    }
    if (order_max) {
        filters.push('stocks.quantity_in_order <= $' + (filters.length + 1))
        values.push(order_max)
    }

    try {
        const result = await pool.query(
            `SELECT stocks.*, products.plu, products.name FROM stocks
            JOIN products ON stocks.product_id = products.id
            ${filters.length > 0 ? 'WHERE ' + filters.join(' AND ') : ''}`,
            values)
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Получение товаров по фильтрам
app.get('/products', async (req, res) => {
    const { name, plu } = req.query
    let filters = []
    let values = []

    if (name) {
        filters.push('name ILIKE $' + (filters.length + 1))
        values.push(`%${name}%`)
    }
    if (plu) {
        filters.push('plu = $' + (filters.length + 1))
        values.push(plu)
    }

    try {
        const result = await pool.query(
            `SELECT * FROM products
            ${filters.length > 0 ? 'WHERE ' + filters.join(' AND ') : ''}`,
            values)
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.listen(PORT, () => console.log('SERVER STARTED ON PORT: ' + PORT))


