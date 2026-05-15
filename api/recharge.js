import pg from 'pg';
import bcrypt from 'bcryptjs';
import axios from 'axios';

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
        const { email, password, number, type, operator, amount, packageId } = req.body;

        if (!email || !password || !number || !amount) {
            return res.status(400).json({
                success: false,
                message: 'সব তথ্য দেওয়া বাধ্যতামূলক'
            });
        }

        const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User পাওয়া যায়নি' });
        }

        const user = userResult.rows[0];
        const rechargeAmount = parseFloat(amount);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Password ভুল' });
        }

        if (parseFloat(user.balance) < rechargeAmount) {
            return res.status(400).json({
                success: false,
                message: `Balance কম! আপনার balance: ৳${user.balance}`
            });
        }

        const trxid = 'STU' + Date.now();
        const stuPayload = {
            number, type, operator,
            amount: rechargeAmount,
            trxid,
            successtopup_key: process.env.STU_KEY,
            successtopup_secret: process.env.STU_SECRET
        };

        if (packageId) stuPayload.package_id = packageId;

        const stuResponse = await axios.post(
            'https://api.successtopup.com/api/recharge',
            stuPayload,
            { headers: { 'Content-Type': 'application/json' } }
        );

        if (!stuResponse.data.result) {
            return res.status(400).json({
                success: false,
                message: stuResponse.data.message || 'Recharge failed'
            });
        }

        const newBalance = parseFloat(user.balance) - rechargeAmount;
        await pool.query(
            'UPDATE users SET balance = $1 WHERE email = $2',
            [newBalance, email]
        );

        try {
            await pool.query(
                `INSERT INTO transactions (user_id, type, amount, balance_after, description, created_at)
         VALUES ($1, 'recharge', $2, $3, $4, NOW())`,
                [user.id, rechargeAmount, newBalance, `Mobile Recharge: ${number}`]
            );
        } catch (txError) {
            console.log('Transaction log skipped:', txError.message);
        }

        return res.status(200).json({
            success: true,
            message: stuResponse.data.message || 'Recharge successful',
            transactionId: trxid,
            newBalance
        });

    } catch (error) {
        console.error('Recharge Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message
        });
    }
};