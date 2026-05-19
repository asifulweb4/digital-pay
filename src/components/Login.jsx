import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, Smartphone, Send, QrCode, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/login`, { identity, password });
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onLogin(res.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'লগইন করতে সমস্যা হয়েছে!');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Send size={24} />, label: 'Send Money', color: '#1e40af' },
    { icon: <Smartphone size={24} />, label: 'Recharge', color: '#0284c7' },
    { icon: <QrCode size={24} />, label: 'Scan QR', color: '#10b981' },
    { icon: <Receipt size={24} />, label: 'Bill Pay', color: '#f59e0b' },
  ];

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>

      {/* Soft Ambient Light Background Blobs */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(60px)' }} />

      {/* Clean White Card with Soft Shadow */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 60 }}
        style={{ width: '100%', maxWidth: '440px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '35px', padding: '40px', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.05)', position: 'relative', zIndex: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ width: '65px', height: '65px', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', boxShadow: '0 10px 25px rgba(30, 64, 175, 0.2)' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'white', margin: 0 }}>৳</h1>
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#1e293b', letterSpacing: '-0.5px', margin: 0 }}>Digital Pay</h2>
          <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '4px' }}>The Ultra Premium Fintech Experience</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#475569', marginBottom: '8px' }}>Identity (Email or Phone)</label>
            <input type="text" placeholder="Enter email or mobile" required value={identity} onChange={(e) => setIdentity(e.target.value)} style={{ width: '100%', padding: '15px', borderRadius: '16px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#1e293b', fontWeight: '700', outline: 'none', fontSize: '15px' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#475569', marginBottom: '8px' }}>Account Password</label>
            <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '15px', borderRadius: '16px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#1e293b', fontWeight: '700', outline: 'none', fontSize: '15px' }} />
          </div>

          {error && <div style={{ color: '#ef4444', fontSize: '13px', fontWeight: '800', textAlign: 'center' }}>{error}</div>}

          <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 10px 20px rgba(30, 64, 175, 0.25)' }}>
            {loading ? 'Accessing...' : <>Access Dashboard <ArrowRight size={18} /></>}
          </motion.button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '13px', fontWeight: '700', color: '#64748b' }}>
          New here? <span onClick={() => navigate('/register')} style={{ color: '#1e40af', cursor: 'pointer', textDecoration: 'underline' }}>Create Premium Account</span>
        </div>
      </motion.div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', marginTop: '30px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#10b981' }}>
          <ShieldCheck size={16} strokeWidth={2.5} />
          <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Bank-Grade Security Protocol</span>
        </div>
      </div>
    </div>
  );
};

export default Login;