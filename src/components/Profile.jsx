import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Shield, HelpCircle, LogOut, ChevronRight, Edit3, Heart, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = React.useState(null);
  const [forgotPasswordStep, setForgotPasswordStep] = React.useState(false);

  const handleMenuClick = (label) => {
    if (label === 'Help & Support') {
      window.open('https://wa.me/message/2WPWBDMISBSGL1', '_blank');
      return;
    }
    if (['Personal Information', 'Security & PIN', 'Transaction History', 'Favorites'].includes(label)) {
      setActiveModal(label);
      setForgotPasswordStep(false);
    }
  };

  const menuItems = [
    { icon: <User size={22} />, label: 'Personal Information', sub: 'Name, Phone, Email', color: '#4f46e5' },
    { icon: <Shield size={22} />, label: 'Security & PIN', sub: 'Change your account PIN', color: '#10b981' },
    { icon: <Wallet size={22} />, label: 'Transaction History', sub: 'View your recent activity', color: '#f59e0b' },
    { icon: <Heart size={22} />, label: 'Favorites', sub: 'Quick access numbers', color: '#ec4899' },
    { icon: <HelpCircle size={22} />, label: 'Help & Support', sub: 'Get assistance 24/7', color: '#06b6d4' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px', paddingBottom: '120px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Premium Profile Header */}
      <div style={{ textAlign: 'center', margin: '40px 0 50px' }}>
        <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 25px' }}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            style={{ width: '100%', height: '100%', borderRadius: '45px', background: 'linear-gradient(135deg, #4f46e5, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '5px solid white', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            <User size={60} color="white" strokeWidth={3} />
          </motion.div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '45px', height: '45px', borderRadius: '15px', background: 'white', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', cursor: 'pointer' }}
          >
            <Edit3 size={20} strokeWidth={3} />
          </motion.button>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{user.name}</h2>
        <p style={{ color: 'var(--text-dim)', fontWeight: '700', marginTop: '5px', fontSize: '15px' }}>{user.phone || user.email}</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '25px' }}>
          <div style={{ padding: '12px 25px', background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
            <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Account Status</p>
            <p style={{ fontSize: '15px', fontWeight: '900', color: '#10b981', marginTop: '4px' }}>Active</p>
          </div>
          <div style={{ padding: '12px 25px', background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
            <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Member Since</p>
            <p style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-main)', marginTop: '4px' }}>May 2026</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '800px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', marginLeft: '10px', marginBottom: '5px' }}>Account Settings</h3>
        {menuItems.map((item, idx) => (
          <motion.div 
            key={idx} 
            onClick={() => handleMenuClick(item.label)}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              padding: '22px', background: 'white', borderRadius: '28px', border: '1px solid #f1f5f9',
              boxShadow: '0 8px 20px rgba(0,0,0,0.02)', cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ 
                width: '55px', height: '55px', borderRadius: '18px', 
                background: `${item.color}10`, color: item.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {item.icon}
              </div>
              <div>
                <span style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-main)' }}>{item.label}</span>
                <p style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600', marginTop: '2px' }}>{item.sub}</p>
              </div>
            </div>
            <ChevronRight size={22} color="#cbd5e1" strokeWidth={3} />
          </motion.div>
        ))}

        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onLogout}
          style={{ 
            marginTop: '30px', display: 'flex', gap: '20px', alignItems: 'center', 
            background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', 
            padding: '22px', borderRadius: '28px', width: '100%', cursor: 'pointer'
          }}
        >
          <div style={{ width: '55px', height: '55px', borderRadius: '18px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogOut size={22} strokeWidth={3} />
          </div>
          <div style={{ textAlign: 'left' }}>
             <span style={{ fontSize: '17px', fontWeight: '900' }}>Logout</span>
             <p style={{ fontSize: '13px', opacity: 0.8, fontWeight: '600' }}>Securely exit your account</p>
          </div>
        </motion.button>
      </div>

      {/* Modals */}
      {activeModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(5px)'
        }} onClick={() => setActiveModal(null)}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: '24px', padding: '30px',
              width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            {activeModal === 'Personal Information' && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '20px', color: 'var(--text-main)' }}>Personal Information</h3>
                <div style={{ marginBottom: '15px', background: '#f8fafc', padding: '15px', borderRadius: '16px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>Name</p>
                  <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>{user.name || 'Not provided'}</p>
                </div>
                <div style={{ marginBottom: '15px', background: '#f8fafc', padding: '15px', borderRadius: '16px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>Phone</p>
                  <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>{user.phone || 'Not provided'}</p>
                </div>
                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '16px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>Email</p>
                  <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>{user.email || 'Not provided'}</p>
                </div>
              </div>
            )}

            {activeModal === 'Security & PIN' && !forgotPasswordStep && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '15px', color: 'var(--text-main)' }}>Security & PIN</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-dim)', marginBottom: '20px', fontWeight: '600', lineHeight: '1.5' }}>Manage your account security. If you forgot your website password, you can reset it here.</p>
                
                <button 
                  onClick={() => setForgotPasswordStep(true)}
                  style={{
                  width: '100%', padding: '16px', background: '#fef2f2', color: '#ef4444',
                  borderRadius: '16px', border: '1px solid #fee2e2', fontWeight: '800',
                  fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                }}>
                  <Shield size={18} /> Forgot Password?
                </button>
              </div>
            )}

            {activeModal === 'Security & PIN' && forgotPasswordStep && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '15px', color: 'var(--text-main)' }}>Reset Password</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-dim)', marginBottom: '20px', fontWeight: '600', lineHeight: '1.5' }}>Enter your registered email or phone number to receive a reset link.</p>
                
                <input 
                  type="text" 
                  placeholder="Email or Phone Number"
                  style={{
                    width: '100%', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0',
                    fontSize: '15px', fontWeight: '600', marginBottom: '15px', outline: 'none', boxSizing: 'border-box'
                  }}
                />

                <button 
                  onClick={() => {
                    alert('Password reset link sent to your contact.');
                    setForgotPasswordStep(false);
                    setActiveModal(null);
                  }}
                  style={{
                  width: '100%', padding: '16px', background: '#4f46e5', color: 'white',
                  borderRadius: '16px', border: 'none', fontWeight: '800',
                  fontSize: '15px', cursor: 'pointer', marginBottom: '10px'
                }}>
                  Send Reset Link
                </button>

                <button 
                  onClick={() => setForgotPasswordStep(false)}
                  style={{
                    width: '100%', padding: '16px', background: 'transparent', color: 'var(--text-dim)',
                    borderRadius: '16px', border: 'none', fontWeight: '800',
                    fontSize: '15px', cursor: 'pointer'
                  }}
                >
                  Back
                </button>
              </div>
            )}

            {activeModal === 'Transaction History' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '70px', height: '70px', background: '#fffbeb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#f59e0b' }}>
                  <Wallet size={35} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '10px', color: 'var(--text-main)' }}>No Transactions</h3>
                <p style={{ fontSize: '15px', color: 'var(--text-dim)', fontWeight: '600' }}>You haven't made any transactions yet.</p>
              </div>
            )}

            {activeModal === 'Favorites' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '70px', height: '70px', background: '#fce7f3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#ec4899' }}>
                  <Heart size={35} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '10px', color: 'var(--text-main)' }}>No Favorites Yet</h3>
                <p style={{ fontSize: '15px', color: 'var(--text-dim)', fontWeight: '600' }}>You haven't added any quick access numbers.</p>
              </div>
            )}


            <button 
              onClick={() => setActiveModal(null)}
              style={{
                width: '100%', padding: '16px', marginTop: '25px', background: '#f1f5f9',
                color: 'var(--text-main)', border: 'none', borderRadius: '16px',
                fontWeight: '800', fontSize: '15px', cursor: 'pointer'
              }}
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Profile;
