import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Landmark, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Withdraw = ({ user, onBalanceUpdate }) => {
    const navigate = useNavigate();
    const [method, setMethod] = useState('bkash'); // bkash বা nagad
    const [number, setNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleWithdraw = async (e) => {
        e.preventDefault();
        if (!user?.email) return setMessage({ type: 'error', text: 'দয়া করে আগে লগইন করুন!' });

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('/api/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    method,
                    number,
                    amount
                })
            });

            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                setNumber('');
                setAmount('');
                if (onBalanceUpdate) onBalanceUpdate(data.newBalance); // মেইন ব্যালেন্স লাইভ আপডেট করার জন্য
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'সার্ভার সমস্যা! আবার চেষ্টা করুন।' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px', background: '#f8fafc', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '35px', maxWidth: '500px', margin: '0 auto 35px' }}>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate('/')} style={{ background: 'white', border: '1px solid #e2e8f0', width: '50px', height: '50px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}><ArrowLeft size={24} /></motion.button>
                <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1e293b' }}>Withdraw Money</h2>
            </div>

            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                {/* Balance Card */}
                <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', padding: '25px', borderRadius: '28px', color: 'white', marginBottom: '30px', boxShadow: '0 15px 30px rgba(99, 102, 241, 0.2)' }}>
                    <p style={{ fontSize: '14px', opacity: 0.8, fontWeight: '600' }}>Available Balance</p>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', marginTop: '5px' }}>৳ {user?.balance || '0.00'}</h2>
                </div>

                {/* Withdraw Form */}
                <div style={{ background: 'white', padding: '30px', borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
                    <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Method Selection */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '800', color: '#64748b', marginBottom: '10px' }}>Select Gateway</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div onClick={() => setMethod('bkash')} style={{ padding: '15px', borderRadius: '16px', border: method === 'bkash' ? '2px solid #d01c6a' : '1px solid #cbd5e1', background: method === 'bkash' ? '#fdf2f8' : 'transparent', textAlign: 'center', fontWeight: '800', color: method === 'bkash' ? '#d01c6a' : '#64748b', cursor: 'pointer', transition: 'all 0.2s' }}>bKash</div>
                                <div onClick={() => setMethod('nagad')} style={{ padding: '15px', borderRadius: '16px', border: method === 'nagad' ? '2px solid #ff4500' : '1px solid #cbd5e1', background: method === 'nagad' ? '#fff5f0' : 'transparent', textAlign: 'center', fontWeight: '800', color: method === 'nagad' ? '#ff4500' : '#64748b', cursor: 'pointer', transition: 'all 0.2s' }}>Nagad</div>
                            </div>
                        </div>

                        {/* Account Number */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '800', color: '#64748b', marginBottom: '8px' }}>{method.toUpperCase()} Account Number</label>
                            <input type="text" placeholder="01XXXXXXXXX" required maxLength={11} value={number} onChange={(e) => setNumber(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid #cbd5e1', fontWeight: '700', outline: 'none', fontSize: '16px' }} />
                        </div>

                        {/* Amount */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '800', color: '#64748b', marginBottom: '8px' }}>Amount (৳)</label>
                            <input type="number" placeholder="0.00" required value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid #cbd5e1', fontWeight: '700', outline: 'none', fontSize: '16px' }} />
                        </div>

                        {/* Response Message */}
                        {message.text && (
                            <div style={{ padding: '12px 16px', borderRadius: '12px', background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', color: message.type === 'success' ? '#15803d' : '#b91c1c', fontWeight: '700', fontSize: '14px', textAlign: 'center' }}>
                                {message.text}
                            </div>
                        )}

                        {/* Submit Button */}
                        <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            {loading ? 'Processing...' : <>Withdraw Now <Send size={18} /></>}
                        </motion.button>
                    </form>
                </div>

                {/* Info Box */}
                <div style={{ marginTop: '30px', padding: '20px', background: '#f0f9ff', borderRadius: '20px', border: '1px solid #e0f2fe', display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ color: '#0369a1' }}><ShieldCheck size={24} /></div>
                    <p style={{ fontSize: '13px', color: '#0c4a6e', fontWeight: '600', lineHeight: '1.4' }}>উইথড্র করার ১-৬ ঘণ্টার মধ্যে আপনার ওয়ালেটে টাকা পৌঁছে যাবে। কোনো সমস্যা হলে আমাদের সাপোর্ট সেন্টারে যোগাযোগ করুন।</p>
                </div>
            </div>
        </motion.div>
    );
};

export default Withdraw;