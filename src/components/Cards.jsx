import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, ShieldCheck, Zap, Plus, ChevronRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cards = ({ user }) => {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px', paddingBottom: '120px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '35px', maxWidth: '800px', margin: '0 auto 35px' }}>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')} 
          style={{ 
            background: 'white', 
            border: '2px solid var(--primary)', 
            color: 'var(--primary)', 
            width: '50px', 
            height: '50px', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer', 
            boxShadow: '0 4px 10px var(--primary-glow)' 
          }}
        >
          <ArrowLeft size={24} strokeWidth={3} />
        </motion.button>
        <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>My Cards</h2>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Virtual Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            padding: '30px',
            borderRadius: '30px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            marginBottom: '30px'
          }}
        >
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div>
              <p style={{ fontSize: '12px', fontWeight: '800', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '2px' }}>Virtual Debit Card</p>
              <h3 style={{ fontSize: '20px', fontWeight: '900', marginTop: '5px' }}>Digital Pay Platinum</h3>
            </div>
            <div style={{ width: '50px', height: '35px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', borderRadius: '8px' }}></div>
          </div>

          <div style={{ marginTop: '50px', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '4px' }}>•••• •••• •••• 4829</h2>
          </div>

          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
            <div>
              <p style={{ fontSize: '10px', fontWeight: '800', opacity: 0.6, textTransform: 'uppercase' }}>Card Holder</p>
              <p style={{ fontSize: '16px', fontWeight: '800', marginTop: '2px' }}>{user.name.toUpperCase()}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '10px', fontWeight: '800', opacity: 0.6, textTransform: 'uppercase' }}>Expires</p>
              <p style={{ fontSize: '16px', fontWeight: '800', marginTop: '2px' }}>09/28</p>
            </div>
          </div>
        </motion.div>

        {/* Card Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '40px' }}>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            style={{ padding: '20px', borderRadius: '25px', background: 'white', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={20} strokeWidth={3} />
            </div>
            <span style={{ fontWeight: '800', fontSize: '14px' }}>Freeze Card</span>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            style={{ padding: '20px', borderRadius: '25px', background: 'white', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f0fdf4', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} strokeWidth={3} />
            </div>
            <span style={{ fontWeight: '800', fontSize: '14px' }}>Card Settings</span>
          </motion.button>
        </div>

        {/* Other Cards */}
        <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '20px' }}>Linked Accounts</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <motion.div 
            whileTap={{ scale: 0.98 }}
            style={{ padding: '22px', background: 'white', borderRadius: '28px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ width: '55px', height: '55px', borderRadius: '18px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={24} strokeWidth={3} />
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)' }}>City Bank Amex</p>
                <p style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>Linked Account • 5920</p>
              </div>
            </div>
            <ChevronRight size={22} color="#cbd5e1" strokeWidth={3} />
          </motion.div>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            style={{ 
              padding: '25px', borderRadius: '28px', border: '2px dashed #e2e8f0', background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--text-dim)',
              cursor: 'pointer', transition: 'all 0.3s ease'
            }}
          >
            <Plus size={24} strokeWidth={3} />
            <span style={{ fontWeight: '900', fontSize: '16px' }}>Link New Card</span>
          </motion.button>
        </div>

        {/* Safety Tip */}
        <div style={{ marginTop: '50px', padding: '25px', background: '#f0f9ff', borderRadius: '25px', border: '1px solid #e0f2fe', display: 'flex', gap: '20px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: '#bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1', flexShrink: 0 }}>
             <ShieldCheck size={26} strokeWidth={3} />
          </div>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '900', color: '#0369a1' }}>Secured by Digital Pay</h4>
            <p style={{ fontSize: '13px', color: '#0c4a6e', fontWeight: '600', marginTop: '4px', lineHeight: '1.4' }}>
              Your card details are encrypted with military-grade security. Never share your PIN or OTP with anyone.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cards;
