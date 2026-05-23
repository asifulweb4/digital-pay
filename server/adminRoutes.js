// server/adminRoutes.js
import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// ===== Admin Credentials (env থেকে নেবে) =====
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@digitalpay.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "adminSecretKey999";

// ===== Simple Token Middleware =====
function adminAuth(req, res, next) {
    const token = req.headers["x-admin-token"];
    if (token !== ADMIN_SECRET) {
        return res.status(401).json({ success: false, message: "অ্যাডমিন অ্যাক্সেস নেই" });
    }
    next();
}

// ===== POST /api/admin/login =====
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        res.json({ success: true, token: ADMIN_SECRET, message: "সফলভাবে লগইন হয়েছে" });
    } else {
        res.status(401).json({ success: false, message: "ইমেইল বা পাসওয়ার্ড ভুল" });
    }
});

// ===== GET /api/admin/stats =====
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const usersCount = await pool.query('SELECT COUNT(*) as total FROM users');
        const totalBalance = await pool.query('SELECT COALESCE(SUM(balance), 0) as total FROM users');
        const txCount = await pool.query('SELECT COUNT(*) as total FROM transactions');
        const totalAdded = await pool.query(
            "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'add_money'"
        );
        const totalSent = await pool.query(
            "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'send_money'"
        );

        res.json({
            success: true,
            totalUsers: parseInt(usersCount.rows[0].total),
            totalBalance: parseFloat(totalBalance.rows[0].total),
            totalTransactions: parseInt(txCount.rows[0].total),
            totalAdded: parseFloat(totalAdded.rows[0].total),
            totalSent: parseFloat(totalSent.rows[0].total),
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ===== GET /api/admin/users =====
router.get('/users', adminAuth, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, phone, balance FROM users ORDER BY id DESC'
        );
        res.json({ success: true, users: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ===== GET /api/admin/transactions =====
router.get('/transactions', adminAuth, async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT 
        t.id,
        t.user_email,
        u.name as user_name,
        t.type,
        t.amount,
        t.description,
        t.created_at
      FROM transactions t
      LEFT JOIN users u ON t.user_email = u.email
      ORDER BY t.created_at DESC
      LIMIT 200
    `);
        res.json({ success: true, transactions: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ===== DELETE /api/admin/users/:id =====
router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await pool.query('SELECT email FROM users WHERE id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ success: false, message: "ইউজার পাওয়া যায়নি" });
        }
        await pool.query('DELETE FROM transactions WHERE user_email = $1', [user.rows[0].email]);
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ success: true, message: "ইউজার সফলভাবে ডিলিট হয়েছে" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ===== POST /api/admin/adjust-balance =====
router.post('/adjust-balance', adminAuth, async (req, res) => {
    const { userId, amount } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING email, balance',
            [parseFloat(amount), userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "ইউজার পাওয়া যায়নি" });
        }
        await pool.query(
            "INSERT INTO transactions (user_email, type, amount, description) VALUES ($1, 'admin_adjust', $2, 'Admin balance adjustment')",
            [result.rows[0].email, Math.abs(parseFloat(amount))]
        );
        res.json({ success: true, newBalance: result.rows[0].balance, message: "ব্যালেন্স আপডেট হয়েছে" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;