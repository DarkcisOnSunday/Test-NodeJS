import { Router, Request, Response } from 'express'
import pool from './db'

const router = Router()

// Добавление данных в историю
router.post('/actions', async (req: Request, res: Response) => {
    const { product_id, shop_id, action, quantity } = req.body
    try {
        const result = await pool.query(
            `INSERT INTO actions (product_id, shop_id, action, quantity)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [product_id, shop_id, action, quantity]
        )
        res.status(200).json(result.rows[0])
    } catch (error : any) {
        res.status(500).json({ error: error.message })
    }
})

// Получение истории действий
router.get('/actions', async (req: Request, res: Response) => {
    const { shop_id, plu, date_from, date_to, action, page = 1, limit = 10 } = req.query

    let filters: string[] = []
    let values: any[] = []
    
    if (shop_id) {
        filters.push(`actions.shop_id = $${filters.length + 1}`)
        values.push(shop_id)
    }
    if (plu) {
        filters.push(`products.plu = $${filters.length + 1}`)
        values.push(plu)
    }
    if (date_from) {
        filters.push(`actions.date >= $${filters.length + 1}`)
        values.push(date_from)
    }
    if (date_to) {
        filters.push(`actions.date <= $${filters.length + 1}`)
        values.push(date_to)
    }
    if (action) {
        filters.push(`actions.action = $${filters.length + 1}`)
        values.push(action)
    }

    values.push(limit, (Number(page) - 1) * Number(limit))

    try {
        const result = await pool.query(
            `SELECT actions.*, products.plu, products.name, shops.name 
            FROM actions
            JOIN products ON actions.product_id = products.id 
            JOIN shops ON actions.shop_id = shops.id 
            ${filters.length > 0 ? 'WHERE ' + filters.join(' AND ') : ''} 
            ORDER BY actions.date DESC 
            LIMIT $${filters.length + 1} OFFSET $${filters.length + 2}`,
            values
        )
        res.status(200).json({
            data: result.rows,
            page: Number(page),
            limit: Number(limit),
            total: result.rows.length
        })
    } catch (error : any) {
        res.status(500).json({ error: error.message })
    }
})

export default router