import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, User, Info, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SendMoney = ({ user, onUpdateBalance }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ receiver: '', amount: '', password: '' });
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleSend = (e) => {
    e.preventDefault();
    if (parseFloat(formData.amount) > user?.balance) {
      setError('আপনার ব্যালেন্স পর্যাপ্ত নয়।');
      return;
    }
    
    if (formData.receiver.length < 11) {
      setError('সঠিক মোবাইল নাম্বার দিন।');
      return;
    }

    // লজিক
    const newBalance = user.balance - parseFloat(formData.amount);
    onUpdateBalance(newBalance);
    setStep(2);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px', paddingBottom: '120px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', maxWidth: '800px', margin: '0 auto 35px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)} 
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
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Send Money</h2>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '10px 20px', borderRadius: '15px', border: '2px solid var(--primary)', background: 'var(--primary-glow)' }}>
          <h3 style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '18px' }}>৳ {parseFloat(user?.balance || 0).toFixed(2)}</h3>
        </div>
      </div>

      {step === 1 && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {error && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: '#fef2f2', color: 'var(--error)', padding: '18px', borderRadius: '20px', fontSize: '15px', fontWeight: '700', textAlign: 'center', border: '2px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                <Info size={20} strokeWidth={3} />
                {error}
              </motion.div>
            )}

            <div className="glass-card" style={{ padding: '30px' }}>
              <div className="input-group">
                <label>Receiver Number</label>
                <div style={{ position: 'relative' }}>
                  <User size={22} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', strokeWidth: 3 }} />
                  <input 
                    type="tel" placeholder="01XXXXXXXXX" required
                    value={formData.receiver}
                    onChange={(e) => setFormData({...formData, receiver: e.target.value})}
                    style={{ width: '100%', padding: '20px 20px 20px 60px', borderRadius: '22px', background: 'white', border: '2px solid #f1f5f9', color: 'var(--text-main)', fontSize: '20px', fontWeight: '800', outline: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginTop: '30px' }}>
                <label>Amount (৳)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '25px', top: '50%', transform: 'translateY(-50%)', fontSize: '24px', fontWeight: '900', color: 'var(--primary)' }}>৳</span>
                  <input 
                    type="number" placeholder="Enter amount" required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    style={{ width: '100%', padding: '22px 22px 22px 55px', borderRadius: '25px', background: 'white', border: '2px solid #f1f5f9', color: 'var(--text-main)', fontSize: '32px', fontWeight: '900', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginTop: '30px' }}>
                <label>Account PIN</label>
                <input 
                  type="password" required placeholder="••••" 
                  value={formData.password} 
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                  style={{ width: '100%', padding: '22px', borderRadius: '25px', background: 'white', border: '2px solid #f1f5f9', color: 'var(--text-main)', fontSize: '32px', letterSpacing: '12px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }} 
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ height: '75px', fontSize: '20px', borderRadius: '28px', boxShadow: '0 15px 35px var(--primary-glow)' }}>
              <Send size={26} strokeWidth={3} /> Send Money Now
            </button>
          </form>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', marginTop: '20px', maxWidth: '600px', margin: '20px auto' }} className="glass-card">
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', border: '3px solid #dcfce7' }}>
            <CheckCircle2 size={70} color="var(--success)" strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '15px', letterSpacing: '-0.5px' }}>Transaction Successful!</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '18px', fontWeight: '600' }}>৳ {formData.amount} has been sent to {formData.receiver}</p>
          
          <div style={{ margin: '40px 0', padding: '30px', background: '#f8fafc', borderRadius: '30px', border: '2px dashed #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ color: 'var(--text-dim)', fontWeight: '700' }}>Recipient</span>
              <span style={{ fontWeight: '900', color: 'var(--text-main)' }}>{formData.receiver}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)', fontWeight: '700' }}>Trx ID</span>
              <span style={{ fontWeight: '900', color: 'var(--primary)' }}>TXN{Date.now().toString().slice(-8)}</span>
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', borderRadius: '25px', height: '70px' }} onClick={() => navigate('/')}>Done</button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SendMoney;