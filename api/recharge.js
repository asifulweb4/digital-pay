const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { email, amount, password } = req.body;

        // ১. সব field আছে কিনা চেক
        if (!email || !amount || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email, amount এবং password দরকার'
            });
        }

        // ২. User খোঁজো
        const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User পাওয়া যায়নি'
            });
        }

        const user = userResult.rows[0];

        // ৩. Password চেক করো
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Password ভুল'
            });
        }

        // ৪. Balance চেক করো
        const rechargeAmount = parseFloat(amount);
        if (user.balance < rechargeAmount) {
            return res.status(400).json({
                success: false,
                message: `Balance কম! আপনার balance: ৳${user.balance}`
            });
        }

        // ৫. Balance কমাও এবং transaction save করো
        const newBalance = parseFloat(user.balance) - rechargeAmount;

        await pool.query(
            'UPDATE users SET balance = $1 WHERE email = $2',
            [newBalance, email]
        );

        // ৬. Transaction history save করো (যদি table থাকে)
        try {
            await pool.query(
                `INSERT INTO transactions (user_id, type, amount, balance_after, description, created_at)
         VALUES ($1, 'recharge', $2, $3, 'Mobile Recharge', NOW())`,
                [user.id, rechargeAmount, newBalance]
            );
        } catch (txError) {
            // transactions table না থাকলে ignore করো
            console.log('Transaction log skipped:', txError.message);
        }

        return res.status(200).json({
            success: true,
            message: 'Balance update successful',
            newBalance: newBalance,
            deducted: rechargeAmount
        });

    } catch (error) {
        console.error('Recharge API Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message
        });
    }
};