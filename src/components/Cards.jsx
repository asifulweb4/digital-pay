import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, ShieldCheck, Zap, Plus, ChevronRight, Lock, X, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cards = ({ user }) => {
  const navigate = useNavigate();

  // ১. স্টেট ম্যানেজমেন্ট
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showBalance, setShowBalance] = useState(false);

  // নতুন কার্ডের ফর্ম ওপেন করার স্টেট
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Debit Card',
    number: '',
    balance: '',
    brand: 'visa'
  });

  // ২. Neon ডেটাবেজ থেকে নির্দিষ্ট ইউজারের কার্ড নিয়ে আসা
  const fetchCards = async () => {
    if (!user?.email) return;
    try {
      const response = await fetch(`/api/cards?email=${user.email}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setLinkedAccounts(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Neon ডেটাবেজ থেকে ডাটা আনতে সমস্যা হয়েছে:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [user?.email]);

  // ৩. নতুন কার্ড বা বিকাশ একাউন্ট ডেটাবেজে সেভ করার ফাংশন
  const handleLinkNewCard = async (e) => {
    e.preventDefault();
    if (!user?.email) return alert("দয়া করে প্রথমে লগইন করুন!");

    let bg_color = '#eff6ff';
    let icon_color = '#2563eb';

    if (formData.brand === 'bkash') {
      bg_color = '#fdf2f8';
      icon_color = '#d01c6a';
    } else if (formData.brand === 'amex') {
      bg_color = '#fef2f2';
      icon_color = '#ef4444';
    }

    let formattedNumber = formData.number;
    if (formData.brand !== 'bkash' && formData.number.length >= 4) {
      formattedNumber = `•••• •••• •••• ${formData.number.slice(-4)}`;
    }

    const payload = {
      user_email: user.email,
      name: formData.name,
      type: formData.brand === 'bkash' ? 'MFS Account' : formData.type,
      number: formattedNumber,
      bg_color: bg_color,
      icon_color: icon_color,
      balance: parseFloat(formData.balance) || 0.00,
      holder: user?.name?.toUpperCase() || 'ASIFUL ISLAM'
    };

    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();
      if (resData.success) {
        setIsFormOpen(false);
        setFormData({ name: '', type: 'Debit Card', number: '', balance: '', brand: 'visa' });
        fetchCards();
      } else {
        alert("কার্ড লিঙ্ক করতে ব্যর্থ হয়েছে!");
      }
    } catch (error) {
      console.error("Error linking card:", error);
      alert("সার্ভার সমস্যা! আবার চেষ্টা করুন।");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px', paddingBottom: '120px', background: '#f8fafc', minHeight: '100vh', position: 'relative' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '35px', maxWidth: '800px', margin: '0 auto 35px' }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate('/')} style={{ background: 'white', border: '2px solid var(--primary)', color: 'var(--primary)', width: '50px', height: '50px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px var(--primary-glow)' }}><ArrowLeft size={24} strokeWidth={3} /></motion.button>
        <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>My Cards</h2>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Main Virtual Card */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={() => setSelectedCard({ name: 'Digital Pay Platinum', type: 'Virtual Debit Card', number: '•••• •••• •••• 4829', balance: user?.balance || '0.00', holder: user?.name?.toUpperCase() || 'ASIFUL', bgColor: '#1e293b', isMain: true })} style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', padding: '30px', borderRadius: '30px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', marginBottom: '30px', cursor: 'pointer' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div><p style={{ fontSize: '12px', fontWeight: '800', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '2px' }}>Virtual Debit Card</p><h3 style={{ fontSize: '20px', fontWeight: '900', marginTop: '5px' }}>Digital Pay Platinum</h3></div>
            <div style={{ width: '50px', height: '35px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', borderRadius: '8px' }}></div>
          </div>
          <div style={{ marginTop: '50px', position: 'relative', zIndex: 1 }}><h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '4px' }}>•••• •••• •••• 4829</h2></div>
          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
            <div><p style={{ fontSize: '10px', fontWeight: '800', opacity: 0.6, textTransform: 'uppercase' }}>Card Holder</p><p style={{ fontSize: '16px', fontWeight: '800', marginTop: '2px' }}>{user?.name ? user.name.toUpperCase() : 'ASIFUL'}</p></div>
            <div style={{ textAlign: 'right' }}><p style={{ fontSize: '10px', fontWeight: '800', opacity: 0.6, textTransform: 'uppercase' }}>Expires</p><p style={{ fontSize: '16px', fontWeight: '800', marginTop: '2px' }}>09/28</p></div>
          </div>
        </motion.div>

        {/* Card Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '40px' }}>
          <motion.button whileTap={{ scale: 0.95 }} style={{ padding: '20px', borderRadius: '25px', background: 'white', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={20} strokeWidth={3} /></div>
            <span style={{ fontWeight: '800', fontSize: '14px' }}>Freeze Card</span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} style={{ padding: '20px', borderRadius: '25px', background: 'white', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f0fdf4', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={20} strokeWidth={3} /></div>
            <span style={{ fontWeight: '800', fontSize: '14px' }}>Card Settings</span>
          </motion.button>
        </div>

        {/* Linked Accounts */}
        <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '20px' }}>Linked Accounts</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-dim)', fontWeight: '700' }}>Loading Accounts from Neon...</p>
          ) : linkedAccounts.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)', fontWeight: '600', background: 'white', borderRadius: '25px', border: '1px solid #f1f5f9' }}>No cards found in Neon Database.</p>
          ) : (
            linkedAccounts.map((account) => (
              <motion.div key={account.id} whileTap={{ scale: 0.98 }} onClick={() => { setSelectedCard(account); setShowBalance(false); }} style={{ padding: '22px', background: 'white', borderRadius: '28px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '55px', height: '55px', borderRadius: '18px', background: account.bg_color, color: account.icon_color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CreditCard size={24} strokeWidth={3} /></div>
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)' }}>{account.name}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>{account.type} • {account.number}</p>
                  </div>
                </div>
                <ChevronRight size={22} color="#cbd5e1" strokeWidth={3} />
              </motion.div>
            ))
          )}

          <motion.button onClick={() => setIsFormOpen(true)} whileTap={{ scale: 0.95 }} style={{ padding: '25px', borderRadius: '28px', border: '2px dashed #e2e8f0', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--text-dim)', cursor: 'pointer' }}>
            <Plus size={24} strokeWidth={3} />
            <span style={{ fontWeight: '900', fontSize: '16px' }}>Link New Card</span>
          </motion.button>
        </div>
      </div>

      {/* --- পপ-আপ: অ্যাকাউন্ট ডিটেইলস মোডাল --- */}
      <AnimatePresence>
        {selectedCard && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ background: 'white', width: '100%', maxWidth: '450px', borderRadius: '32px', padding: '30px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative' }}>
              <button onClick={() => setSelectedCard(null)} style={{ position: 'absolute', top: '25px', right: '25px', background: '#f1f5f9', border: 'none', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}><X size={18} strokeWidth={3} /></button>
              <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#1e293b', marginBottom: '25px' }}>Account Details</h3>
              <div style={{ background: selectedCard.isMain ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : selectedCard.icon_color, padding: '25px', borderRadius: '24px', color: 'white', marginBottom: '25px' }}>
                <p style={{ fontSize: '11px', fontWeight: '700', opacity: 0.8, textTransform: 'uppercase' }}>{selectedCard.type}</p>
                <h4 style={{ fontSize: '18px', fontWeight: '800', marginTop: '2px' }}>{selectedCard.name}</h4>
                <p style={{ fontSize: '18px', fontWeight: '700', marginTop: '25px', letterSpacing: '2px' }}>{selectedCard.number}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', background: '#f8fafc', borderRadius: '18px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>Current Balance</p>
                    <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#1e293b', marginTop: '2px' }}>{showBalance ? `৳ ${selectedCard.balance}` : '৳ ••••'}</h3>
                  </div>
                  <button onClick={() => setShowBalance(!showBalance)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>{showBalance ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
                <div style={{ padding: '5px 10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Account Holder</span><span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '800' }}>{selectedCard.holder || 'ASIFUL ISLAM'}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Status</span><span style={{ fontSize: '13px', color: '#22c55e', fontWeight: '800' }}>● Active</span></div>
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setSelectedCard(null)} style={{ width: '100%', padding: '16px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '18px', marginTop: '25px', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}>Close Details</motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- পপ-আপ: নতুন কার্ড অ্যাড করার সুন্দর ফর্ম মোডাল (ফিক্সড লেআউট) --- */}
      <AnimatePresence>
        {isFormOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{
                background: 'white',
                width: '100%',
                maxWidth: '450px',
                borderRadius: '32px',
                padding: '30px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                position: 'relative',
                maxHeight: '82vh', // নেভিগেশন বারের ওপরে থাকার জন্য হাইট ফিক্স করা হলো
                overflowY: 'auto'   // ভেতরের ফর্ম স্ক্রল করার জন্য
              }}
            >
              <button onClick={() => setIsFormOpen(false)} style={{ position: 'absolute', top: '25px', right: '25px', background: '#f1f5f9', border: 'none', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}><X size={18} strokeWidth={3} /></button>

              <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#1e293b', marginBottom: '20px' }}>Link New Account</h3>

              <form onSubmit={handleLinkNewCard} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#64748b', marginBottom: '6px' }}>Account / Brand Type</label>
                  <select value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid #cbd5e1', fontWeight: '700', outline: 'none' }}>
                    <option value="visa">Visa Card</option>
                    <option value="bkash">bKash Wallet</option>
                    <option value="amex">City Bank Amex</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#64748b', marginBottom: '6px' }}>Card / Account Name</label>
                  <input type="text" placeholder="e.g. Brac Bank Visa or bKash Personal" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid #cbd5e1', fontWeight: '700', outline: 'none' }} />
                </div>

                {formData.brand !== 'bkash' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#64748b', marginBottom: '6px' }}>Card Type</label>
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid #cbd5e1', fontWeight: '700', outline: 'none' }}>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Credit Card">Credit Card</option>
                    </select>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#64748b', marginBottom: '6px' }}>
                    {formData.brand === 'bkash' ? 'bKash Mobile Number' : 'Card Number (Last 4 Digits)'}
                  </label>
                  <input type="text" placeholder={formData.brand === 'bkash' ? '017XXXXXXXX' : 'e.g. 8843'} required maxLength={formData.brand === 'bkash' ? 11 : 4} value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid #cbd5e1', fontWeight: '700', outline: 'none' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#64748b', marginBottom: '6px' }}>Initial Balance (৳)</label>
                  <input type="number" placeholder="0.00" required value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid #cbd5e1', fontWeight: '700', outline: 'none' }} />
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: '#1e293b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '18px',
                    marginTop: '10px',
                    marginBottom: '15px', // বাটনের নিচে অতিরিক্ত স্পেস যোগ করা হলো
                    fontWeight: '800',
                    fontSize: '15px',
                    cursor: 'pointer'
                  }}
                >
                  Link Account Now
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Cards;