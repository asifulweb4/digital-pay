import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Landmark, CreditCard, Wallet, ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PaymentGateway from './PaymentGateway';

const AddMoney = ({ user, onUpdateBalance }) => {
  const [amount, setAmount] = useState('');
  const [showGateway, setShowGateway] = useState(false);
  const navigate = useNavigate();

  const handlePaymentSuccess = async (addedAmount) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
      const res = await axios.post(`${API_URL}/api/add-money`, {
        email: user.email,
        amount: parseFloat(addedAmount)
      });
      
      if (res.data.success) {
        const newBalance = res.data.newBalance;
        const updatedUser = { ...user, balance: newBalance };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        onUpdateBalance(newBalance);
      }
    } catch (error) {
      console.error("Add money failed", error);
      alert("Something went wrong while adding money.");
    }
  };

  if (showGateway) {
    return <PaymentGateway amount={amount} onPaymentSuccess={handlePaymentSuccess} />;
  }

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
        <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Add Balance</h2>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="glass-card" style={{ padding: '40px 30px', textAlign: 'center', marginBottom: '30px' }}>
          <p style={{ color: 'var(--text-dim)', marginBottom: '20px', fontWeight: '700' }}>Enter Amount to Add</p>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '36px', fontWeight: '900', marginRight: '15px', color: 'var(--primary)' }}>৳</span>
            <input 
              type="number" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: '100%', maxWidth: '250px', fontSize: '48px', fontWeight: '900', background: 'none', border: 'none', color: 'var(--text-main)', textAlign: 'center', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '40px' }}>
          {['500', '1000', '2000', '5000', '10000', '25000'].map(amt => (
            <motion.button 
              key={amt} 
              whileTap={{ scale: 0.95 }}
              style={{ 
                padding: '20px', 
                fontWeight: '900', 
                background: amount === amt ? 'var(--primary)' : 'white',
                color: amount === amt ? 'white' : 'var(--text-main)',
                border: '1px solid #f1f5f9',
                borderRadius: '20px',
                boxShadow: amount === amt ? '0 10px 20px var(--primary-glow)' : '0 4px 10px rgba(0,0,0,0.02)',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setAmount(amt)}
            >
              ৳ {amt}
            </motion.button>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '25px', padding: '25px', border: '1px solid #f1f5f9', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Info size={24} />
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-dim)', fontWeight: '600', lineHeight: '1.4' }}>
            Balance will be added instantly after successful payment verification.
          </p>
        </div>

        <button 
          className="btn-primary" 
          style={{ width: '100%', height: '75px', fontSize: '20px', borderRadius: '25px' }}
          disabled={!amount || parseFloat(amount) <= 0}
          onClick={() => setShowGateway(true)}
        >
          Proceed to Payment <ChevronRight size={22} strokeWidth={3} />
        </button>

        <div style={{ marginTop: '50px', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-dim)', marginBottom: '25px', fontWeight: '800', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Secured by Trusted Partners</h4>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', opacity: 0.4 }}>
            <Landmark size={45} />
            <CreditCard size={45} />
            <Wallet size={45} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddMoney;
