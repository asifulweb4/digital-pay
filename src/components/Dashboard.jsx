import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Smartphone, Send, Landmark, Receipt, User, QrCode, Bell, Zap, Gift, ShieldCheck, Eye, EyeOff, Search, MoreHorizontal, TrendingUp, Wallet, Star, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAILS = ['asiful12@gmail.com']; // যে email গুলো admin সেগুলো এখানে দাও

const Dashboard = ({ user }) => {
  const [showBalance, setShowBalance] = useState(false);
  const [stats, setStats] = useState({ savings: 0, expenses: 0 });
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    if (user?.email) {
      const fetchStats = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/stats/${user.email}`);
          if (res.data.success) {
            setStats({ savings: res.data.savings, expenses: res.data.expenses });
          }
        } catch (error) {
          console.error("Failed to fetch stats", error);
        }
      };
      fetchStats();
    }
  }, [user, API_URL]);

  const services = [
    { icon: <Smartphone size={26} />, label: 'Recharge', path: '/recharge', color: '#0284c7' },
    { icon: <QrCode size={26} />, label: 'Scan QR', path: '/scan', color: '#10b981' },
    { icon: <Receipt size={26} />, label: 'Bill Pay', path: '/bill-pay', color: '#f59e0b' },
    { icon: <Zap size={26} />, label: 'Regular Pack', path: '/regular-pack', color: '#6366f1' },
    { icon: <Landmark size={26} />, label: 'Add Money', path: '/add-money', color: '#0ea5e9' },
    { icon: <Gift size={26} />, label: 'Rewards', path: '/rewards', color: '#ec4899' },
    { icon: <MoreHorizontal size={26} />, label: 'More', path: '/more', color: '#64748b' },
  ];

  const recentTransactions = [
    { id: 1, name: 'bKash Wallet', type: 'MFS Transfer', amount: '৳ ৪,৮৫০.৫০', isIncome: true, color: '#ec4899', bg: '#fdf2f8' },
    { id: 2, name: 'Visa Platinum', type: 'Card Bill', amount: '৳ ১,১২,৯০০.০০', isIncome: false, color: '#1e40af', bg: '#eff6ff' }
  ];

  const formatBalance = () => {
    const bal = user?.balance ? parseFloat(user.balance) : 0;
    return bal.toLocaleString(undefined, { minimumFractionDigits: 2 });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '140px', background: '#f8fafc', minHeight: '100vh', position: 'relative', overflowX: 'hidden', color: '#1e293b' }}>

      <div style={{ position: 'absolute', top: '5%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(50px)' }} />

      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <header style={{ padding: '30px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.div whileHover={{ scale: 1.05 }} onClick={() => navigate('/profile')} style={{ width: '55px', height: '55px', borderRadius: '20px', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white', boxShadow: '0 10px 25px rgba(30, 64, 175, 0.15)', cursor: 'pointer' }}>
              <User color="white" size={26} />
            </motion.div>
            <div>
              <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', margin: 0 }}>Welcome Back,</p>
              <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1e293b', letterSpacing: '-0.5px', margin: 0 }}>{user?.name || 'Asiful'}</h2>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            {/* ===== ADMIN BUTTON — শুধু admin email হলে দেখাবে ===== */}
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '10px 16px', borderRadius: '14px', border: 'none',
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  color: 'white', fontWeight: '800', fontSize: '13px',
                  cursor: 'pointer', boxShadow: '0 4px 15px rgba(168,85,247,0.35)',
                  fontFamily: 'inherit',
                }}
              >
                <Shield size={16} />
                অ্যাডমিন
              </motion.button>
            )}
            <motion.button whileTap={{ scale: 0.9 }} style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'white', border: '1px solid #e2e8f0', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}><Search size={22} /></motion.button>
            <motion.button whileTap={{ scale: 0.9 }} style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'white', border: '1px solid #e2e8f0', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}><Bell size={22} /></motion.button>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', marginTop: '10px' }}>

          {/* Balance Card */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)', padding: '35px', borderRadius: '35px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(30, 64, 175, 0.25)' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.15)', padding: '6px 14px', borderRadius: '100px' }}>
                <ShieldCheck size={14} />
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Premium Account</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>DIGITAL PAY</span>
            </div>

            <div style={{ marginTop: '30px' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Total Available Balance</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '8px' }}>
                <h1 style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: '900', letterSpacing: '-1px', margin: 0 }}>
                  {showBalance ? `৳ ${formatBalance()}` : '৳ ••••••'}
                </h1>
                <button onClick={() => setShowBalance(!showBalance)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '10px', borderRadius: '12px', color: 'white', cursor: 'pointer', display: 'flex' }}>
                  {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <motion.button onClick={() => navigate('/add-money')} whileTap={{ scale: 0.95 }} style={{ background: 'white', color: '#1e40af', border: 'none', padding: '16px 5px', borderRadius: '20px', fontWeight: '900', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                <Landmark size={18} /> Add
              </motion.button>
              {/*<motion.button onClick={() => navigate('/send')} whileTap={{ scale: 0.95 }} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 5px', borderRadius: '20px', fontWeight: '900', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                <Send size={18} /> Send
              </motion.button>*/}
              <motion.button onClick={() => navigate('/withdraw')} whileTap={{ scale: 0.95 }} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 5px', borderRadius: '20px', fontWeight: '900', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                <Wallet size={18} /> Withdraw
              </motion.button>
            </div>
          </motion.div>

          {/* Savings vs Expenses */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '24px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '14px', background: '#f0fdf4', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={22} /></div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', margin: 0 }}>Savings</p>
                <h4 style={{ fontSize: '16px', fontWeight: '900', color: '#1e293b', marginTop: '4px', margin: 0 }}>+৳{Number(stats.savings).toFixed(2)}</h4>
              </div>
            </div>
            <div style={{ padding: '24px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '14px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wallet size={22} /></div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', margin: 0 }}>Expenses</p>
                <h4 style={{ fontSize: '16px', fontWeight: '900', color: '#1e293b', marginTop: '4px', margin: 0 }}>-৳{Number(stats.expenses).toFixed(2)}</h4>
              </div>
            </div>
          </div>

          {/* Services */}
          <section style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '19px', fontWeight: '900', color: '#1e293b', margin: 0 }}>Our Services</h3>
              <span style={{ fontSize: '13px', color: '#1e40af', fontWeight: '800', cursor: 'pointer' }}>View All</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '16px' }}>
              {services.map((s, idx) => (
                <motion.div key={idx} whileHover={{ y: -5 }} onClick={() => navigate(s.path)} style={{ padding: '20px 10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#f8fafc', color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                    {s.icon}
                  </div>
                  <span style={{ fontSize: '13px', color: '#475569', fontWeight: '700', marginTop: '10px', textAlign: 'center' }}>{s.label}</span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Latest Transactions */}
          <section style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '19px', fontWeight: '900', color: '#1e293b', margin: 0 }}>Latest Transactions</h3>
              <span onClick={() => navigate('/history')} style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', cursor: 'pointer' }}>See All</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentTransactions.map(t => (
                <div key={t.id} style={{ padding: '18px 24px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: t.bg, color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px' }}>৳</div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b', margin: 0 }}>{t.name}</h4>
                      <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginTop: '2px', margin: 0 }}>{t.type}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: '900', color: t.isIncome ? '#22c55e' : '#1e293b' }}>{t.amount}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Promo Banner */}
          <div style={{ marginTop: '10px' }}>
            <div style={{ padding: '25px 30px', borderRadius: '28px', background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 15px 35px rgba(30, 64, 175, 0.2)' }}>
              <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '90px', height: '90px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}><Star size={24} fill="#fbbf24" /></div>
                <div>
                  <h4 style={{ fontSize: '17px', fontWeight: '900', margin: 0 }}>Exclusive Reward!</h4>
                  <p style={{ fontSize: '13px', opacity: 0.8, marginTop: '4px', fontWeight: '600', margin: 0 }}>Get up to 5% cashback on your first bill pay.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;