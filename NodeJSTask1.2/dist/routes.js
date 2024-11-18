"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("./db"));
const router = (0, express_1.Router)();
// Добавление данных в историю
router.post('/actions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { product_id, shop_id, action, quantity } = req.body;
    try {
        const result = yield db_1.default.query(`INSERT INTO actions (product_id, shop_id, action, quantity)
             VALUES ($1, $2, $3, $4) RETURNING *`, [product_id, shop_id, action, quantity]);
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Получение истории действий
router.get('/actions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shop_id, plu, date_from, date_to, action, page = 1, limit = 10 } = req.query;
    let filters = [];
    let values = [];
    if (shop_id) {
        filters.push(`actions.shop_id = $${filters.length + 1}`);
        values.push(shop_id);
    }
    if (plu) {
        filters.push(`products.plu = $${filters.length + 1}`);
        values.push(plu);
    }
    if (date_from) {
        filters.push(`actions.date >= $${filters.length + 1}`);
        values.push(date_from);
    }
    if (date_to) {
        filters.push(`actions.date <= $${filters.length + 1}`);
        values.push(date_to);
    }
    if (action) {
        filters.push(`actions.action = $${filters.length + 1}`);
        values.push(action);
    }
    values.push(limit, (Number(page) - 1) * Number(limit));
    try {
        const result = yield db_1.default.query(`SELECT actions.*, products.plu, products.name, shops.name 
            FROM actions
            JOIN products ON actions.product_id = products.id 
            JOIN shops ON actions.shop_id = shops.id 
            ${filters.length > 0 ? 'WHERE ' + filters.join(' AND ') : ''} 
            ORDER BY actions.date DESC 
            LIMIT $${filters.length + 1} OFFSET $${filters.length + 2}`, values);
        res.status(200).json({
            data: result.rows,
            page: Number(page),
            limit: Number(limit),
            total: result.rows.length
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
