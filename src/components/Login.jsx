import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, Send, Smartphone, QrCode, Receipt, Zap, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ identity: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000');

  const services = [
    { icon: <Send size={24} />, label: 'Send Money', color: '#6366f1', delay: 0.1 },
    { icon: <Smartphone size={24} />, label: 'Recharge', color: '#f43f5e', delay: 0.2 },
    { icon: <QrCode size={24} />, label: 'Scan QR', color: '#10b981', delay: 0.3 },
    { icon: <Receipt size={24} />, label: 'Bill Pay', color: '#f59e0b', delay: 0.4 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        identity: formData.identity,
        password: formData.password
      });

      if (response.data.success) {
        const userData = response.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        onLogin(userData);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      style={{ 
        minHeight: '100vh', 
        background: '#f8fafc', 
        position: 'relative', 
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      
      {/* Dynamic Animated Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', zIndex: 0, overflow: 'hidden' }}>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)', borderRadius: '50%' }}
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -120, 0],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)', borderRadius: '50%' }}
        />
      </div>

      {/* Main Content Container */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Animated Header Section */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ 
            padding: '60px 20px 80px', 
            background: 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)', 
            borderRadius: '0 0 60px 60px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(79, 70, 229, 0.15)'
          }}
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            style={{ width: '90px', height: '90px', background: 'white', borderRadius: '28px', margin: '0 auto 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}
          >
            <div style={{ width: '65px', height: '65px', borderRadius: '18px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '36px', fontWeight: '900' }}>৳</div>
          </motion.div>
          <h1 style={{ fontSize: '38px', fontWeight: '900', color: 'white', letterSpacing: '-1.5px', marginBottom: '8px' }}>Digital Pay</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: '16px' }}>The Ultra Premium Fintech Experience</p>
        </motion.div>

        {/* Login Form Section */}
        <div style={{ padding: '0 20px', marginTop: '-50px', width: '100%', maxWidth: '800px', margin: '-50px auto 40px' }}>
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ 
              background: 'white', 
              padding: '40px', 
              borderRadius: '40px', 
              boxShadow: '0 30px 60px rgba(0,0,0,0.08)', 
              border: '1px solid rgba(255,255,255,1)' 
            }}
          >
            <div style={{ marginBottom: '35px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-main)' }}>Welcome Back</h2>
              <p style={{ fontSize: '15px', color: 'var(--text-dim)', fontWeight: '600', marginTop: '5px' }}>Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {error && (
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background: '#fef2f2', color: 'var(--error)', padding: '18px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', textAlign: 'center', border: '1px solid #fee2e2' }}>
                  {error}
                </motion.div>
              )}

              <div className="input-group">
                <label style={{ fontSize: '15px' }}>Identity (Email or Phone)</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={22} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                  <input 
                    type="text" required placeholder="Enter email or mobile"
                    value={formData.identity} onChange={(e) => setFormData({...formData, identity: e.target.value})}
                    style={{ width: '100%', padding: '22px 22px 22px 60px', borderRadius: '22px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '17px', fontWeight: '700', transition: '0.3s' }}
                  />
                </div>
              </div>

              <div className="input-group">
                <label style={{ fontSize: '15px' }}>Account Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={22} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                  <input 
                    type="password" required placeholder="••••••••"
                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                    style={{ width: '100%', padding: '22px 22px 22px 60px', borderRadius: '22px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '17px', fontWeight: '700', transition: '0.3s' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ height: '75px', borderRadius: '25px', fontSize: '20px', boxShadow: '0 15px 35px var(--primary-glow)' }} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <>Access Dashboard <ArrowRight size={22} strokeWidth={3} /></>}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '35px' }}>
               <p style={{ fontSize: '15px', color: 'var(--text-dim)', fontWeight: '700' }}>
                 New here? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '900', textDecoration: 'none', borderBottom: '2px solid transparent' }}>Create Premium Account</Link>
               </p>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Services Preview */}
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto 60px', padding: '0 20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', marginBottom: '30px' }}>Premium Features</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {services.map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: s.delay }}
                whileHover={{ y: -8, scale: 1.05 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ width: '100%', aspectRatio: '1/1', background: 'white', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid rgba(255,255,255,1)' }}>
                   {s.icon}
                </div>
                <p style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', marginTop: '12px' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          style={{ textAlign: 'center', paddingBottom: '40px', opacity: 0.6 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.5)', padding: '12px 25px', borderRadius: '100px', border: '1px solid #f1f5f9' }}>
            <ShieldCheck size={20} color="#10b981" />
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>Bank-Grade Security Protocol</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;