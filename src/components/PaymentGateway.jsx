import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Landmark, Wallet, CheckCircle2, ShieldCheck, ChevronRight, Smartphone, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentGateway = ({ amount, onPaymentSuccess }) => {
  const [step, setStep] = useState(1); // 1: Methods, 2: Details/Instructions, 3: Processing, 4: Success
  const [method, setMethod] = useState(null);
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = (num) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3); // Processing
    setTimeout(() => {
      setStep(4); // Success
      onPaymentSuccess(parseFloat(amount));
    }, 2500);
  };

  const methods = [
    { id: 'bkash', label: 'bKash', color: '#e2136e', type: 'MFS', number: '01333858547' },
    { id: 'nagad', label: 'Nagad', color: '#f7941d', type: 'MFS', number: '01747156607' },
    { id: 'rocket', label: 'Rocket', color: '#8c3494', type: 'MFS', number: '01XXXXXXXXX' },
    { id: 'upay', label: 'Upay', color: '#00adef', type: 'MFS', number: '01XXXXXXXXX' },
    { id: 'card', label: 'Card / Net Banking', color: '#4f46e5', type: 'Gateway', number: null },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#f8fafc', color: '#1e293b', zIndex: 10000, overflowY: 'auto' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Gateway Header */}
        <div style={{ background: 'white', padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => step > 1 && step < 3 ? setStep(1) : navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <ArrowLeft size={24} />
            </button>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Secure Checkout</h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Payable</p>
            <h3 style={{ color: 'var(--primary)', fontWeight: '800' }}>৳ {amount}</h3>
          </div>
        </div>

        <div style={{ padding: '20px', flex: 1 }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} key="step1">
                <h4 style={{ marginBottom: '20px', color: '#475569', fontSize: '16px', fontWeight: '700' }}>Select Payment Method</h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {methods.map((m) => (
                    <motion.div
                      key={m.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setMethod(m); setStep(2); }}
                      style={{
                        background: 'white', padding: '18px', borderRadius: '20px', border: '1px solid #e2e8f0',
                        display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ width: '45px', height: '45px', background: `${m.color}15`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color, fontWeight: '800', fontSize: '12px' }}>
                        {m.id === 'card' ? <CreditCard /> : m.label[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '700', fontSize: '15px' }}>{m.label}</p>
                        <p style={{ fontSize: '12px', color: '#64748b' }}>Pay with {m.label} securely</p>
                      </div>
                      <ChevronRight size={18} color="#cbd5e1" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && method && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step2">
                <div className="glass-card" style={{ padding: '25px', background: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: '40px', height: '40px', background: `${method.color}15`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: method.color, fontWeight: '800' }}>{method.label[0]}</div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{method.label} Payment</h3>
                  </div>

                  {method.number ? (
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '18px', marginBottom: '25px', border: '1px solid #e2e8f0' }}>
                      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>Please Send Money to this number:</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>{method.number}</h2>
                        <button
                          onClick={() => handleCopy(method.number)}
                          type="button"
                          style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                        >
                          {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '18px', marginBottom: '25px', border: '1px solid #e2e8f0' }}>
                      <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', fontWeight: '600' }}>You will be redirected to the secure gateway for Card payment.</p>
                    </div>
                  )}

                  <form onSubmit={handlePaymentSubmit}>
                    <div className="input-group">
                      <label style={{ fontWeight: '700' }}>Transaction ID (TrxID)</label>
                      <input
                        type="text" required placeholder="8N7X2M9K"
                        value={trxId} onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                        style={{ height: '60px', borderRadius: '16px', border: '2px solid #e2e8f0', background: '#f8fafc', padding: '0 20px', fontSize: '18px', fontWeight: '700', letterSpacing: '1px' }}
                      />
                    </div>

                    <div style={{ padding: '15px', background: '#fff9eb', border: '1px solid #ffeeba', borderRadius: '12px', marginBottom: '25px' }}>
                      <p style={{ fontSize: '12px', color: '#856404', lineHeight: '1.6' }}>
                        <strong>Instructions:</strong> Go to your {method.label} App, select Send Money, enter the number above and the amount <strong>৳{amount}</strong>. After successful payment, copy the Transaction ID and paste it here.
                      </p>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', height: '60px', borderRadius: '18px' }}>
                      Verify Payment
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  style={{ width: '60px', height: '60px', border: '5px solid #f1f5f9', borderTopColor: 'var(--primary)', borderRadius: '50%' }}
                />
                <h3 style={{ marginTop: '25px', fontWeight: '800' }}>Verifying Transaction...</h3>
                <p style={{ color: '#64748b', textAlign: 'center', marginTop: '10px', fontSize: '14px' }}>Please wait while we confirm your payment with the provider.</p>
              </div>
            )}

            {step === 4 && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #dcfce7' }}>
                  <CheckCircle2 size={60} color="#22c55e" />
                </div>
                <h2 style={{ marginTop: '25px', fontWeight: '800', fontSize: '24px' }}>Add Money Successful!</h2>
                <p style={{ color: '#64748b', marginTop: '10px', textAlign: 'center' }}>৳ {amount} has been successfully added to your wallet balance.</p>

                <div style={{ width: '100%', background: 'white', padding: '20px', borderRadius: '20px', marginTop: '30px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>Transaction ID</span>
                    <span style={{ fontWeight: '700', fontSize: '13px' }}>{trxId}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>Method</span>
                    <span style={{ fontWeight: '700', fontSize: '13px' }}>{method.label}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/')}
                  style={{ width: '100%', marginTop: '40px', background: '#1e293b', color: 'white', border: 'none', padding: '18px', borderRadius: '18px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                >
                  Back to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ padding: '20px', textAlign: 'center', borderTop: '1px solid #e2e8f0', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#94a3b8' }}>
            <ShieldCheck size={18} />
            <span style={{ fontSize: '13px', fontWeight: '600' }}>100% Secure Transaction</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
