import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Send, Landmark, Receipt, History, User, QrCode, Bell, ChevronRight, Zap, Gift, ShieldCheck, Eye, EyeOff, Search, MoreHorizontal, UserPlus, LogIn, ArrowRight, TrendingUp, Wallet, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [showBalance, setShowBalance] = useState(false);
  const navigate = useNavigate();

  const services = [
    { icon: <Send size={26} />, label: 'Send Money', path: '/send', color: '#6366f1' },
    { icon: <Smartphone size={26} />, label: 'Recharge', path: '/recharge', color: '#f43f5e' },
    { icon: <QrCode size={26} />, label: 'Scan QR', path: '/scan', color: '#10b981' },
    { icon: <Receipt size={26} />, label: 'Bill Pay', path: '/bill-pay', color: '#f59e0b' },
    { icon: <Zap size={26} />, label: 'Regular Pack', path: '/regular-pack', color: '#8b5cf6' },
    { icon: <Landmark size={26} />, label: 'Add Money', path: '/add-money', color: '#06b6d4' },
    { icon: <Gift size={26} />, label: 'Rewards', path: '/rewards', color: '#ec4899' },
    { icon: <MoreHorizontal size={26} />, label: 'More', path: '/more', color: '#64748b' },
  ];

  const handleServiceClick = (path) => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '120px', background: '#f8fafc', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Dynamic Animated Background */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '10%', right: '-10%', width: '400px', height: '400px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }}
      />
      <motion.div 
        animate={{ y: [0, 30, 0], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', bottom: '20%', left: '-10%', width: '350px', height: '350px', background: 'var(--secondary)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none' }}
      />
      
      {/* Content Wrapper for Centering on Desktop */}
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Premium Header */}
        <header style={{ padding: '30px 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ position: 'relative' }}>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate('/profile')}
                  style={{ width: '55px', height: '55px', borderRadius: '20px', background: 'linear-gradient(135deg, #4f46e5, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: 'pointer' }}
                >
                  <User color="white" size={30} />
                </motion.div>
                <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '14px', height: '14px', background: '#22c55e', border: '2px solid white', borderRadius: '50%' }}></div>
              </div>
              <div>
                <h4 style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: '700' }}>Welcome Back,</h4>
                <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{user.name}</h2>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
               <div style={{ width: '55px', height: '55px', borderRadius: '20px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={30} color="var(--primary)" />
               </div>
               <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-1px' }}>Digital Pay</h2>
            </div>
          )}

          <div style={{ display: 'flex', gap: '15px' }}>
            {!user ? (
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/login')}
                style={{ padding: '12px 25px', borderRadius: '15px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '900', boxShadow: '0 8px 20px var(--primary-glow)' }}
              >
                Join Now
              </motion.button>
            ) : (
              <>
                <motion.button whileTap={{ scale: 0.9 }} style={{ width: '52px', height: '52px', borderRadius: '18px', background: 'white', border: '2px solid #f1f5f9', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Search size={24} strokeWidth={3} />
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} style={{ width: '52px', height: '52px', borderRadius: '18px', background: 'white', border: '2px solid #f1f5f9', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={24} strokeWidth={3} />
                </motion.button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section - Responsive Grid */}
        <div style={{ padding: '0 20px', marginBottom: '40px' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            
            {/* Main Balance Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="balance-card" 
              style={{ width: '100%', maxWidth: 'none', margin: '0' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '100px', width: 'fit-content' }}>
                    <ShieldCheck size={14} />
                    <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Premium Account</span>
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', opacity: 0.8 }}>Total Available Balance</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '8px' }}>
                      <h1 style={{ fontSize: 'clamp(30px, 5vw, 40px)', fontWeight: '900', letterSpacing: '-1px' }}>
                        {showBalance ? `৳ ${parseFloat(user?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '৳ ••••••'}
                      </h1>
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowBalance(!showBalance)}
                        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '10px', borderRadius: '12px', color: 'white', cursor: 'pointer' }}
                      >
                        {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                      </motion.button>
                    </div>
                  </div>
                </div>
                <div style={{ width: '60px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <div style={{ width: '30px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }}></div>
                </div>
              </div>

              <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
                <motion.button onClick={() => navigate('/add-money')} whileTap={{ scale: 0.95 }} style={{ flex: 1, background: 'white', color: 'var(--primary)', border: 'none', padding: '18px', borderRadius: '22px', fontWeight: '900', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                  <Landmark size={22} /> Add Money
                </motion.button>
                <motion.button onClick={() => navigate('/send')} whileTap={{ scale: 0.95 }} style={{ flex: 1, background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '18px', borderRadius: '22px', fontWeight: '900', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <Send size={22} /> Send Money
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Stats Container */}
            <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}
                 style={{ padding: '25px', background: 'white', borderRadius: '32px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}
               >
                 <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: '#f0fdf4', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={24} />
                 </div>
                 <div>
                   <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-dim)' }}>Savings</p>
                   <h4 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-main)' }}>+৳4,250</h4>
                 </div>
               </motion.div>
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }}
                 style={{ padding: '25px', background: 'white', borderRadius: '32px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}
               >
                 <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wallet size={24} />
                 </div>
                 <div>
                   <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-dim)' }}>Expenses</p>
                   <h4 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-main)' }}>-৳1,120</h4>
                 </div>
               </motion.div>
            </div>
          </div>
        </div>

        {/* Modern Service Grid */}
        <section style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '19px', fontWeight: '900', color: 'var(--text-main)' }}>Our Services</h3>
            <motion.span whileTap={{ opacity: 0.5 }} style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '800', cursor: 'pointer' }}>View All</motion.span>
          </div>
          <div className="service-grid" style={{ padding: 0 }}>
            {services.map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="service-item"
                onClick={() => handleServiceClick(service.path)}
              >
                <div className="service-icon" style={{ background: `${service.color}10`, color: service.color, border: `1px solid ${service.color}20`, width: '75px', height: '75px', borderRadius: '25px' }}>
                  {service.icon}
                </div>
                <span style={{ fontSize: '14px', marginTop: '5px' }}>{service.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Promo / Banner Section */}
        <div style={{ padding: '0 20px', marginTop: '40px' }}>
          <motion.div 
            whileTap={{ scale: 0.98 }}
            style={{ padding: '30px', borderRadius: '35px', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
            <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
                 <Star size={32} fill="#fbbf24" />
              </div>
              <div>
                <h4 style={{ fontSize: '20px', fontWeight: '900' }}>Exclusive Reward!</h4>
                <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px', fontWeight: '600' }}>Get up to 5% cashback on your first bill pay.</p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

export default Dashboard;
