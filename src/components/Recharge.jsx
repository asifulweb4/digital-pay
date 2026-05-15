import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Loader2, Check, Smartphone, Info, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { rechargeMobile } from '../services/api';

// লোগো ইমপোর্ট
import airtelLogo from '../assets/airtel.png';
import blLogo from '../assets/bl.png';
import gpLogo from '../assets/gp.png';
import robiLogo from '../assets/robi.png';
import teletalkLogo from '../assets/teletalk.png';
import skittoLogo from '../assets/skitto.png';
import brilliantLogo from '../assets/brilliant.png';

const Recharge = ({ user, onUpdateBalance }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOperators, setShowOperators] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    number: '',
    amount: '',
    simType: 'prepaid',
    operator: 'Grameenphone',
    operatorCode: 'GP',
    password: ''
  });

  const operators = [
    { name: 'Banglalink', code: 'BL', icon: blLogo },
    { name: 'Grameenphone', code: 'GP', icon: gpLogo },
    { name: 'Robi', code: 'RB', icon: robiLogo },
    { name: 'Airtel', code: 'AT', icon: airtelLogo },
    { name: 'Teletalk', code: 'TT', icon: teletalkLogo },
    { name: 'Skitto', code: 'SK', icon: skittoLogo },
    { name: 'Brilliant', code: 'BT', icon: brilliantLogo }
  ];

  useEffect(() => {
    if (location.state?.selectedAmount) {
      const op = operators.find(o => o.name === location.state.selectedOperator);
      setFormData(prev => ({
        ...prev,
        amount: location.state.selectedAmount.toString(),
        operator: location.state.selectedOperator || prev.operator,
        operatorCode: location.state.selectedCode || op?.code || prev.operatorCode
      }));
    }
  }, []);

  const handleRecharge = async (e) => {
    e.preventDefault();
    if (parseFloat(formData.amount) > user.balance) {
      setError('আপনার ব্যালেন্স পর্যাপ্ত নয়।');
      return;
    }

    if (formData.number.length < 11) {
      setError('সঠিক মোবাইল নাম্বার দিন।');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const result = await rechargeMobile(
        formData.number,
        formData.amount,
        formData.operator,
        formData.simType,
        null,
        user.email,
        formData.password
      );

      setIsProcessing(false);
      if (result.success) {
        const newBalance = user.balance - parseFloat(formData.amount);
        onUpdateBalance(newBalance);
        setStep(2);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setIsProcessing(false);
      setError('সিস্টেম ত্রুটি, আবার চেষ্টা করুন।');
    }
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
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Mobile Recharge</h2>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '10px 20px', borderRadius: '15px', border: '2px solid var(--primary)', background: 'var(--primary-glow)' }}>
          <h3 style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '18px' }}>৳ {parseFloat(user?.balance || 0).toFixed(2)}</h3>
        </div>
      </div>

      {step === 1 && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={handleRecharge} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {error && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: '#fef2f2', color: 'var(--error)', padding: '18px', borderRadius: '20px', fontSize: '15px', fontWeight: '700', textAlign: 'center', border: '2px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                <Info size={20} strokeWidth={3} />
                {error}
              </motion.div>
            )}

            <div className="glass-card" style={{ padding: '30px' }}>
              <div className="input-group" style={{ position: 'relative' }}>
                <label>Mobile Number</label>
                <div style={{ display: 'flex', background: 'white', border: '2px solid #f1f5f9', borderRadius: '22px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                  <div
                    onClick={() => setShowOperators(!showOperators)}
                    style={{ width: '100px', height: '75px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRight: '2px solid #f1f5f9', background: '#f8fafc' }}
                  >
                    <img
                      src={operators.find(o => o.name === formData.operator)?.icon}
                      alt="op"
                      style={{ width: '45px', height: '45px', objectFit: 'contain' }}
                    />
                    <ChevronDown size={18} style={{ marginLeft: '4px', color: 'var(--text-dim)', strokeWidth: 3 }} />
                  </div>
                  <input
                    type="tel" required placeholder="01XXXXXXXXX"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    style={{ border: 'none', background: 'none', flex: 1, padding: '20px', color: 'var(--text-main)', fontSize: '24px', fontWeight: '900', letterSpacing: '1px' }}
                  />
                </div>

                <AnimatePresence>
                  {showOperators && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, background: 'white', borderRadius: '28px', marginTop: '15px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', border: '2px solid #f1f5f9', overflow: 'hidden' }}
                    >
                      <div style={{ padding: '20px', borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>
                        <p style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-dim)' }}>Select Mobile Operator</p>
                      </div>
                      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {operators.map(op => (
                          <div
                            key={op.code}
                            onClick={() => { setFormData({ ...formData, operator: op.name, operatorCode: op.code }); setShowOperators(false); }}
                            style={{ padding: '15px 25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid #f8fafc', background: formData.operator === op.name ? 'var(--primary-glow)' : 'transparent', transition: 'all 0.2s ease' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                              <img src={op.icon} alt={op.name} style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
                              <span style={{ fontSize: '17px', color: 'var(--text-main)', fontWeight: '800' }}>{op.name}</span>
                            </div>
                            {formData.operator === op.name && <div style={{ width: '26px', height: '26px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={16} color="white" strokeWidth={4} /></div>}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{ marginTop: '30px' }}>
                <label>SIM Card Type</label>
                <div style={{ display: 'flex', gap: '15px' }}>
                  {['prepaid', 'postpaid'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, simType: type })}
                      style={{ flex: 1, padding: '18px', borderRadius: '20px', border: '3px solid', borderColor: formData.simType === type ? 'var(--primary)' : '#f1f5f9', background: formData.simType === type ? 'white' : '#f8fafc', color: formData.simType === type ? 'var(--primary)' : 'var(--text-dim)', fontWeight: '900', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: formData.simType === type ? '0 8px 20px var(--primary-glow)' : 'none' }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '30px' }}>
                <label>Recharge Amount</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '25px', top: '50%', transform: 'translateY(-50%)', fontSize: '24px', fontWeight: '900', color: 'var(--primary)' }}>৳</span>
                  <input
                    type="number" required placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    style={{ width: '100%', padding: '22px 22px 22px 55px', borderRadius: '25px', background: 'white', border: '2px solid #f1f5f9', color: 'var(--text-main)', fontSize: '32px', fontWeight: '900', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '30px' }}>
                <label>Account PIN</label>
                <input
                  type="password" required placeholder="••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ width: '100%', padding: '22px', borderRadius: '25px', background: 'white', border: '2px solid #f1f5f9', color: 'var(--text-main)', fontSize: '32px', letterSpacing: '12px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ height: '75px', fontSize: '20px', borderRadius: '28px', boxShadow: '0 15px 35px var(--primary-glow)' }} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={26} strokeWidth={3} />
                  Processing...
                </>
              ) : (
                <>
                  <Smartphone size={26} strokeWidth={3} />
                  Confirm Recharge
                </>
              )}
            </button>
          </form>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', marginTop: '20px', maxWidth: '600px', margin: '20px auto' }} className="glass-card">
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', border: '3px solid #dcfce7' }}>
            <CheckCircle2 size={70} color="var(--success)" strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '15px', letterSpacing: '-0.5px' }}>Success!</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '18px', fontWeight: '600' }}>৳ {formData.amount} has been recharged to {formData.number}</p>

          <div style={{ margin: '40px 0', padding: '30px', background: '#f8fafc', borderRadius: '30px', border: '2px dashed #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ color: 'var(--text-dim)', fontWeight: '700' }}>Operator</span>
              <span style={{ fontWeight: '900', color: 'var(--text-main)' }}>{formData.operator}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)', fontWeight: '700' }}>Trx ID</span>
              <span style={{ fontWeight: '900', color: 'var(--primary)' }}>STU{Date.now().toString().slice(-8)}</span>
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', borderRadius: '25px', height: '70px' }} onClick={() => navigate('/')}>Done</button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Recharge;