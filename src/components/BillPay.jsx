import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Loader2, Zap, HelpCircle, Calendar, MessageSquare, Lock, ChevronDown, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BillPay = ({ user, onUpdateBalance }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [showOperators, setShowOperators] = useState(false);
  const [formData, setFormData] = useState({
    billOperator: '',
    billOperatorName: 'Select Operator',
    billNumber: '',
    billAmount: '',
    mobileNumber: '',
    monthName: 'January',
    note: '',
    password: ''
  });
  const [error, setError] = useState('');

  const billOperators = [
    { code: 'PBP', name: 'Palli Bidyut (Prepaid)', icon: '⚡' },
    { code: 'PBD', name: 'Palli Bidyut (Postpaid)', icon: '⚡' },
    { code: 'DSP', name: 'DESCO (Prepaid)', icon: '💡' },
    { code: 'DSD', name: 'DESCO (Postpaid)', icon: '💡' },
    { code: 'TGS', name: 'Titas Gas', icon: '🔥' },
    { code: 'WSA', name: 'Dhaka WASA', icon: '💧' },
    { code: 'AIT', name: 'Amber IT (Internet)', icon: '🌐' },
  ];

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleBillPayment = async (e) => {
    e.preventDefault();
    if (!formData.billOperator) {
      setError('Please select an operator');
      return;
    }
    if (parseFloat(formData.billAmount) > user.balance) {
      setError('Insufficient balance!');
      return;
    }

    setIsProcessing(true);
    setError('');

    // Simulate payment
    setTimeout(() => {
      setIsProcessing(false);
      const newBalance = user.balance - parseFloat(formData.billAmount);
      onUpdateBalance(newBalance);
      setStep(2);
    }, 2000);
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
          <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Bill Payment</h2>
        </div>
        <div className="glass-card" style={{ padding: '10px 20px', borderRadius: '15px', border: '2px solid var(--primary)', background: 'var(--primary-glow)' }}>
          <h3 style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '18px' }}>৳ {parseFloat(user?.balance || 0).toFixed(2)}</h3>
        </div>
      </div>

      {step === 1 && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={handleBillPayment} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {error && (
              <div style={{ background: '#fef2f2', color: 'var(--error)', padding: '15px', borderRadius: '15px', textAlign: 'center', border: '1px solid #fee2e2', fontWeight: '700' }}>
                {error}
              </div>
            )}

            <div className="glass-card" style={{ padding: '30px' }}>
              {/* Operator Selector */}
              <div className="input-group" style={{ position: 'relative' }}>
                <label>Bill Operator</label>
                <div 
                  onClick={() => setShowOperators(!showOperators)}
                  style={{ 
                    background: 'white', color: 'var(--text-main)', border: '2px solid #f1f5f9',
                    padding: '18px 25px', borderRadius: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: '800'
                  }}
                >
                  <span>{formData.billOperatorName}</span>
                  <ChevronDown size={22} strokeWidth={3} style={{ transform: showOperators ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s', color: 'var(--primary)' }} />
                </div>

                <AnimatePresence>
                  {showOperators && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      style={{ 
                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                        background: 'white', border: '2px solid #f1f5f9', borderRadius: '25px', marginTop: '10px',
                        maxHeight: '300px', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                      }}
                    >
                      {billOperators.map(op => (
                        <div 
                          key={op.code}
                          onClick={() => {
                            setFormData({...formData, billOperator: op.code, billOperatorName: op.name});
                            setShowOperators(false);
                          }}
                          style={{ 
                            padding: '18px 25px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer',
                            background: formData.billOperator === op.code ? 'var(--primary-glow)' : 'transparent',
                            borderBottom: '1px solid #f8fafc'
                          }}
                        >
                          <span style={{ fontSize: '24px' }}>{op.icon}</span>
                          <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>{op.name}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{ marginTop: '25px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="input-group">
                  <label>Bill Number</label>
                  <input type="text" required placeholder="Ex: 12345" value={formData.billNumber} onChange={(e) => setFormData({...formData, billNumber: e.target.value})} style={{ width: '100%', padding: '18px', borderRadius: '20px', border: '2px solid #f1f5f9', fontWeight: '800' }} />
                </div>
                <div className="input-group">
                  <label>Billing Month</label>
                  <select value={formData.monthName} onChange={(e) => setFormData({...formData, monthName: e.target.value})} style={{ width: '100%', padding: '18px', borderRadius: '20px', border: '2px solid #f1f5f9', fontWeight: '800', appearance: 'none', background: 'white' }}>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="input-group" style={{ marginTop: '25px' }}>
                <label>Amount (৳)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '25px', top: '50%', transform: 'translateY(-50%)', fontSize: '24px', fontWeight: '900', color: 'var(--primary)' }}>৳</span>
                  <input type="number" required placeholder="0.00" value={formData.billAmount} onChange={(e) => setFormData({...formData, billAmount: e.target.value})} style={{ width: '100%', padding: '22px 22px 22px 55px', borderRadius: '25px', border: '2px solid #f1f5f9', fontSize: '32px', fontWeight: '900' }} />
                </div>
              </div>

              <div className="input-group" style={{ marginTop: '25px' }}>
                <label>Account PIN</label>
                <input type="password" required placeholder="••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '22px', borderRadius: '25px', border: '2px solid #f1f5f9', fontSize: '32px', letterSpacing: '12px', textAlign: 'center' }} />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ height: '75px', fontSize: '20px', borderRadius: '28px' }} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="animate-spin" /> : <Zap size={24} strokeWidth={3} />}
              Pay Bill Now
            </button>
          </form>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', marginTop: '20px', maxWidth: '600px', margin: '20px auto' }} className="glass-card">
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', border: '3px solid #dcfce7' }}>
            <CheckCircle2 size={70} color="var(--success)" strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '15px' }}>Payment Successful!</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '18px', fontWeight: '600' }}>Your {formData.billOperatorName} bill of ৳{formData.billAmount} has been paid.</p>
          
          <div style={{ margin: '40px 0', padding: '30px', background: '#f8fafc', borderRadius: '30px', border: '2px dashed #e2e8f0', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ color: 'var(--text-dim)', fontWeight: '700' }}>Bill No</span>
              <span style={{ fontWeight: '900' }}>{formData.billNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)', fontWeight: '700' }}>Trx ID</span>
              <span style={{ fontWeight: '900', color: 'var(--primary)' }}>BILL{Date.now().toString().slice(-8)}</span>
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', borderRadius: '25px', height: '70px' }} onClick={() => navigate('/')}>Done</button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BillPay;
