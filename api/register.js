import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { name, email, phone, password } = req.body;

        const existing = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
        );
        if (existing.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'এই Email দিয়ে আগেই একাউন্ট আছে'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (name, email, phone, password, balance) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, balance',
            [name, email, phone, hashedPassword, 0]
        );

        return res.status(200).json({
            success: true,
            message: 'Registration successful',
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};