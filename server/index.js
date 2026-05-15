import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import dotenv from 'dotenv';

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
    `);
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Database initialization error:", err.message);
  }
};

initDB();

// --- Routes ---
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
      return res.status(400).json({ success: false, message: "এই ইমেল বা ফোন আগে থেকেই ব্যবহৃত হয়েছে!" });
    }

    const result = await pool.query(
      'INSERT INTO users (name, email, phone, password, balance) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, balance',
      [name, email, phone, password, 0.00]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ২. লগইন এপিআই ---
apiRouter.post('/login', async (req, res) => {
  const { identity, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, balance FROM users WHERE (email = $1 OR phone = $1) AND password = $2',
      [identity, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "ভুল ইমেল/ফোন বা পাসওয়ার্ড!" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ৩. ব্যালেন্স সিঙ্ক এপিআই ---
apiRouter.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const result = await pool.query('SELECT name, email, phone, balance FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "ইউজার পাওয়া যায়নি" });
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
    if (sender.rows[0].balance < amount) {
      throw new Error('পর্যাপ্ত ব্যালেন্স নেই!');
    }
    await pool.query('UPDATE users SET balance = balance - $1 WHERE email = $2', [amount, sender_email]);
    const receiver = await pool.query('UPDATE users SET balance = balance + $1 WHERE phone = $2 RETURNING id', [amount, receiver_phone]);
    if (receiver.rows.length === 0) {
      throw new Error('প্রাপকের ফোন নাম্বার সঠিক নয়!');
    }
    await pool.query('COMMIT');
    res.json({ success: true, message: "টাকা পাঠানো সফল হয়েছে!" });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(400).json({ success: false, message: err.message });
  }
});

// --- ৫. মোবাইল রিচার্জ এপিআই ---
apiRouter.post('/recharge', async (req, res) => {
  const { email, amount, password } = req.body;
  try {
    const user = await pool.query('SELECT password FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0 || user.rows[0].password !== password) {
      return res.status(401).json({ success: false, message: "ভুল পাসওয়ার্ড!" });
    }
    const result = await pool.query(
      'UPDATE users SET balance = balance - $1 WHERE email = $2 AND balance >= $1 RETURNING balance',
      [amount, email]
    );
    if (result.rows.length > 0) {
      res.json({ success: true, newBalance: result.rows[0].balance });
    } else {
      res.status(400).json({ success: false, message: "অপর্যাপ্ত ব্যালেন্স!" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;

// Local development server
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}
