import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { email, method, number, amount } = req.body;

    if (!email || !method || !number || !amount) {
        return res.status(400).json({ success: false, message: 'সবগুলো তথ্য সঠিকভাবে দিন!' });
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount <= 0) {
        return res.status(400).json({ success: false, message: 'সঠিক অ্যামাউন্ট লিখুন!' });
    }

    try {
        // ১. ট্রানজেকশন শুরু (BEGIN)
        await pool.query('BEGIN');

        // ২. ইউজারের বর্তমান ব্যালেন্স চেক করা
        const userResult = await pool.query('SELECT balance FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            throw new Error('ইউজার পাওয়া যায়নি!');
        }

        const currentBalance = parseFloat(userResult.rows[0].balance);
        if (currentBalance < withdrawAmount) {
            throw new Error('আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই!');
        }

        // ৩. ইউজারের অ্যাকাউন্ট থেকে ব্যালেন্স কমানো
        const updateResult = await pool.query(
            'UPDATE users SET balance = balance - $1 WHERE email = $2 RETURNING balance',
            [withdrawAmount, email]
        );

        // ৪. ট্রানজেকশন টেবিলে রেকর্ড জমা করা
        const description = `Withdrawn to ${method.toUpperCase()} (${number})`;
        await pool.query(
            "INSERT INTO transactions (user_email, type, amount, description) VALUES ($1, 'withdraw', $2, $3)",
            [email, withdrawAmount, description]
        );

        // ৫. ট্রানজেকশন সফলভাবে শেষ করা (COMMIT)
        await pool.query('COMMIT');

        return res.status(200).json({
            success: true,
            message: 'উইথড্র রিকোয়েস্ট সফল হয়েছে!',
            newBalance: updateResult.rows[0].balance
        });

    } catch (err) {
        // কোনো ভুল হলে রোলব্যাক করা
        await pool.query('ROLLBACK');
        return res.status(400).json({ success: false, message: err.message });
    }
}