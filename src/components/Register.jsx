import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Smartphone, ArrowRight, Loader2, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/register`, formData);
      if (response.data.success) {
        const userData = response.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        onRegister(userData);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '100vh', background: '#f8fafc', position: 'relative', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* Dynamic Animated Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', zIndex: 0, overflow: 'hidden' }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)', borderRadius: '50%' }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -120, 0], x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)', borderRadius: '50%' }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header Section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          style={{ padding: '50px 20px 70px', background: 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)', borderRadius: '0 0 60px 60px', textAlign: 'center', boxShadow: '0 20px 40px rgba(79, 70, 229, 0.15)' }}
        >
          <h1 style={{ fontSize: '38px', fontWeight: '900', color: 'white', letterSpacing: '-1.5px', marginBottom: '8px' }}>Join Digital Pay</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: '16px' }}>Start your premium journey today</p>
        </motion.div>

        {/* Register Card */}
        <div style={{ padding: '0 20px', marginTop: '-40px', width: '100%', maxWidth: '800px', margin: '-40px auto 40px' }}>
          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ background: 'white', padding: '40px', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,1)' }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {error && (
                <div style={{ background: '#fef2f2', color: 'var(--error)', padding: '15px', borderRadius: '15px', fontSize: '13px', fontWeight: '700', textAlign: 'center', border: '1px solid #fee2e2' }}>
                  {error}
                </div>
              )}

              <div className="input-group">
                <label>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                  <input
                    type="text" required placeholder="John Doe"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', height: '72px', padding: '0 25px 0 60px', borderRadius: '22px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '18px', fontWeight: '700' }}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                  <input
                    type="email" required placeholder="name@example.com"
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', height: '72px', padding: '0 25px 0 60px', borderRadius: '22px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '18px', fontWeight: '700' }}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Smartphone size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                  <input
                    type="tel" required placeholder="017XXXXXXXX"
                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', height: '72px', padding: '0 25px 0 60px', borderRadius: '22px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '18px', fontWeight: '700' }}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Account Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                  <input
                    type="password" required placeholder="••••••••"
                    value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{ width: '100%', height: '72px', padding: '0 25px 0 60px', borderRadius: '22px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '18px', fontWeight: '700' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ height: '70px', borderRadius: '22px', fontSize: '18px', marginTop: '10px' }} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <>Create Premium Account <ArrowRight size={20} strokeWidth={3} /></>}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <p style={{ fontSize: '15px', color: 'var(--text-dim)', fontWeight: '700' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '900', textDecoration: 'none' }}>Sign In</Link>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Security Footer */}
        <div style={{ marginTop: 'auto', paddingBottom: '40px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', padding: '12px 25px', borderRadius: '100px', border: '1px solid #f1f5f9', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
            <ShieldCheck size={18} color="#10b981" strokeWidth={3} />
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)' }}>Bank-Grade Security Protocol</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;