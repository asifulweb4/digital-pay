import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    const { method } = req;

    // ১. নির্দিষ্ট ইউজারের কার্ড লিস্ট গেট এপিআই
    if (method === 'GET') {
        const { email } = req.query; // অথবা URL থেকে ইমেল নেওয়া
        if (!email) return res.status(400).json({ error: 'Email is required' });

        try {
            const result = await pool.query(
                'SELECT id, name, type, number, bg_color, icon_color, balance, holder FROM linked_cards WHERE user_email = $1 ORDER BY id DESC',
                [email]
            );
            return res.status(200).json(result.rows);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    // ২. নতুন কার্ড লিঙ্ক (Insert) করার এপিআই
    if (method === 'POST') {
        const { user_email, name, type, number, bg_color, icon_color, balance, holder } = req.body;
        try {
            const result = await pool.query(
                'INSERT INTO linked_cards (user_email, name, type, number, bg_color, icon_color, balance, holder) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [user_email, name, type, number, bg_color, icon_color, balance || 0.00, holder || 'ASIFUL ISLAM']
            );
            return res.status(200).json({ success: true, card: result.rows[0] });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    // অন্য কোনো মেথড আসলে ৪০৫ এরর
    return res.status(405).json({ error: 'Method Not Allowed' });
}