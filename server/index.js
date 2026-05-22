import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Neon Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// টেবিল তৈরি করার ফাংশন
const initDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.error("CRITICAL ERROR: DATABASE_URL is missing in environment variables!");
    return;
  }
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        balance DECIMAL(12,2) DEFAULT 0.00
      );
      
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_email TEXT NOT NULL,
        type TEXT NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database initialized successfully with transactions table");
  } catch (err) {
    console.error("Database initialization error:", err.message);
  }
};

initDB();

const apiRouter = express.Router();

// Test Route
apiRouter.get('/test', (req, res) => {
  res.json({
    success: true,
    message: "API is working perfectly!",
    env: process.env.DATABASE_URL ? "Database URL is present" : "Database URL is MISSING!"
  });
});

// --- ১. রেজিস্ট্রেশন এপিআই ---
apiRouter.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const checkUser = await pool.query('SELECT * FROM users WHERE email = $1 OR phone = $2', [email, phone]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: "এই ইমেল বা ফোন আগে থেকেই ব্যবহৃত হয়েছে!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, phone, password, balance) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, balance',
      [name, email, phone, hashedPassword, 0.00]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ২. লগইন এপিআই ---
apiRouter.post('/login', async (req, res) => {
  const { identity, password } = req.body;
  try {
    // ইমেল অথবা ফোন যেকোনো একটি মিললেই ইউজার পাওয়া যাবে
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR phone = $1',
      [identity]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        delete user.password; // সিকিউরিটির জন্য পাসওয়ার্ড অবজেক্ট থেকে ডিলিট করা
        return res.json({ success: true, user });
      } else {
        return res.status(401).json({ success: false, message: "ভুল ইমেল/ফোন বা পাসওয়ার্ড!" });
      }
    } else {
      return res.status(401).json({ success: false, message: "ভুল ইমেল/ফোন বা পাসওয়ার্ড!" });
    }
  } catch (err) {
    console.error("লগইন এপিআই এরর:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ৩. ব্যালেন্স সিঙ্ক এপিআই (সংশোধিত: ইমেইল বা ফোন দুটির জন্যই কাজ করবে) ---
apiRouter.get('/user/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const result = await pool.query(
      'SELECT name, email, phone, balance FROM users WHERE email = $1 OR phone = $1',
      [identifier]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ success: false, message: "ইউজার পাওয়া যায়নি" });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// --- ৪. সেন্ড মানি এপিআই ---
apiRouter.post('/send-money', async (req, res) => {
  const { sender_email, receiver_phone, amount } = req.body;
  try {
    await pool.query('BEGIN');
    const sender = await pool.query('SELECT balance FROM users WHERE email = $1', [sender_email]);

    if (sender.rows.length === 0 || sender.rows[0].balance < amount) {
      throw new Error('পর্যাপ্ত ব্যালেন্স নেই বা ইউজার সঠিক নয়!');
    }
    await pool.query('UPDATE users SET balance = balance - $1 WHERE email = $2', [amount, sender_email]);
    const receiver = await pool.query('UPDATE users SET balance = balance + $1 WHERE phone = $2 RETURNING id, email', [amount, receiver_phone]);
    if (receiver.rows.length === 0) {
      throw new Error('প্রাপকের ফোন নাম্বার সঠিক নয়!');
    }

    // Record transactions
    await pool.query(
      "INSERT INTO transactions (user_email, type, amount, description) VALUES ($1, 'send_money', $2, $3)",
      [sender_email, amount, `Sent money to ${receiver_phone}`]
    );
    await pool.query(
      "INSERT INTO transactions (user_email, type, amount, description) VALUES ($1, 'receive', $2, $3)",
      [receiver.rows[0].email, amount, `Received money from ${sender_email}`]
    );

    await pool.query('COMMIT');
    res.json({ success: true, message: "টাকা পাঠানো সফল হয়েছে!" });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(400).json({ success: false, message: err.message });
  }
});

// --- ৪.৫. অ্যাড মানি এপিআই ---
apiRouter.post('/add-money', async (req, res) => {
  const { email, amount } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET balance = balance + $1 WHERE email = $2 RETURNING balance',
      [amount, email]
    );
    if (result.rows.length > 0) {
      await pool.query(
        "INSERT INTO transactions (user_email, type, amount, description) VALUES ($1, 'add_money', $2, 'Added money via Payment Gateway')",
        [email, amount]
      );
      res.json({ success: true, newBalance: result.rows[0].balance });
    } else {
      res.status(404).json({ success: false, message: "ইউজার পাওয়া যায়নি" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ৫. মোবাইল রিচার্জ এপিআই ---
apiRouter.post('/recharge', async (req, res) => {
  const { email, amount, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "ইউজার পাওয়া যায়নি" });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "ভুল পাসওয়ার্ড!" });
    }

    const result = await pool.query(
      'UPDATE users SET balance = balance - $1 WHERE email = $2 AND balance >= $1 RETURNING balance',
      [amount, email]
    );
    if (result.rows.length > 0) {
      await pool.query(
        "INSERT INTO transactions (user_email, type, amount, description) VALUES ($1, 'recharge', $2, $3)",
        [email, amount, `Mobile Recharge`]
      );
      res.json({ success: true, newBalance: result.rows[0].balance });
    } else {
      res.status(400).json({ success: false, message: "অপর্যাপ্ত ব্যালেন্স!" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ৬. ড্যাশবোর্ড স্ট্যাটস এপিআই (সংশোধিত: ইমেইল বা ফোন দুটির জন্যই ট্র্যাক করবে) ---
apiRouter.get('/stats/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;

    // প্রথমে আইডেন্টিফায়ার দিয়ে ইউজারের আসল ইমেইলটি বের করে নেওয়া ভালো, কারণ লেনদেন ইমেইল দিয়ে সেভ হচ্ছে
    const userCheck = await pool.query('SELECT email FROM users WHERE email = $1 OR phone = $1', [identifier]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "ইউজার পাওয়া যায়নি" });
    }
    const email = userCheck.rows[0].email;

    // Calculate total savings
    const savingsResult = await pool.query(
      "SELECT SUM(amount) as total FROM transactions WHERE user_email = $1 AND type IN ('add_money', 'receive')",
      [email]
    );

    // Calculate total expenses
    const expensesResult = await pool.query(
      "SELECT SUM(amount) as total FROM transactions WHERE user_email = $1 AND type IN ('send_money', 'recharge', 'bill_pay')",
      [email]
    );

    res.json({
      success: true,
      savings: savingsResult.rows[0].total || 0,
      expenses: expensesResult.rows[0].total || 0
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));