import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, Send, Landmark, Receipt, Search, Filter, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const History = ({ user }) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, income, expense
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

  // ডাটাবেজ থেকে ট্রানজেকশন ডাটা ফেস করা
  useEffect(() => {
    if (user?.email) {
      fetchTransactionHistory();
    }
  }, [user]);

  const fetchTransactionHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/transactions/${user.email}`);
      if (res.data.success) {
        setTransactions(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load transactions", error);
    } finally {
      setLoading(false);
    }
  };

  // টাইপ অনুযায়ী আইকন সেট করার হেল্পার ফাংশন
  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'recharge': return <Smartphone />;
      case 'send': return <Send />;
      case 'receive': return <ArrowDownLeft />;
      case 'add-money': return <Landmark />;
      case 'bill-pay': return <Receipt />;
      default: return <RefreshCw />;
    }
  };

  // সার্চ এবং ফিল্টার লজিক প্রসেস করা
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = txn.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.type?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === 'income') {
      return matchesSearch && txn.amount.startsWith('+');
    }
    if (filterType === 'expense') {
      return matchesSearch && txn.amount.startsWith('-');
    }
    return matchesSearch;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px', paddingBottom: '120px', background: '#f8fafc', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '35px', maxWidth: '800px', margin: '0 auto 35px' }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')}
          style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            color: '#1e293b',
            width: '50px',
            height: '50px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
          }}
        >
          <ArrowLeft size={24} />
        </motion.button>
        <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1e293b', letterSpacing: '-0.5px' }}>Transactions</h2>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Search & Filter Controls */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', position: 'relative' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '15px 15px 15px 48px', borderRadius: '18px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', fontSize: '14px', outline: 'none', color: '#1e293b' }}
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            style={{ width: '52px', height: '52px', borderRadius: '18px', background: filterType !== 'all' ? '#eff6ff' : 'white', border: `1px solid ${filterType !== 'all' ? '#3b82f6' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: filterType !== 'all' ? '#3b82f6' : '#1e293b', cursor: 'pointer' }}
          >
            <Filter size={20} />
          </motion.button>

          {/* Dynamic Filter Mini Dropdown */}
          {showFilterMenu && (
            <div style={{ position: 'absolute', right: 0, top: '60px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button onClick={() => { setFilterType('all'); setShowFilterMenu(false); }} style={{ padding: '10px 20px', border: 'none', background: filterType === 'all' ? '#f1f5f9' : 'transparent', borderRadius: '10px', fontWeight: '700', textAlign: 'left', cursor: 'pointer', color: '#1e293b' }}>All Transactions</button>
              <button onClick={() => { setFilterType('income'); setShowFilterMenu(false); }} style={{ padding: '10px 20px', border: 'none', background: filterType === 'income' ? '#f1f5f9' : 'transparent', borderRadius: '10px', fontWeight: '700', textAlign: 'left', cursor: 'pointer', color: '#10b981' }}>Incomes (+)</button>
              <button onClick={() => { setFilterType('expense'); setShowFilterMenu(false); }} style={{ padding: '10px 20px', border: 'none', background: filterType === 'expense' ? '#f1f5f9' : 'transparent', borderRadius: '10px', fontWeight: '700', textAlign: 'left', cursor: 'pointer', color: '#ef4444' }}>Expenses (-)</button>
            </div>
          )}
        </div>

        {/* Transaction Content Render Area */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', fontWeight: '700', color: '#64748b' }}>Loading history...</div>
        ) : filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', fontWeight: '700', color: '#64748b' }}>No transactions found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredTransactions.map((txn) => (
              <motion.div
                key={txn.id}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '20px',
                  background: 'white',
                  borderRadius: '28px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.005)'
                }}
              >
                <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
                  <div style={{
                    width: '55px', height: '55px', borderRadius: '18px',
                    background: txn.amount?.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(30, 41, 59, 0.05)',
                    color: txn.amount?.startsWith('+') ? '#10b981' : '#1e293b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {getIcon(txn.type)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '900', color: '#1e293b', margin: 0 }}>{txn.title}</h4>
                    <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700', marginTop: '4px', margin: 0 }}>{txn.date}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h4 style={{ fontSize: '17px', fontWeight: '900', margin: 0, color: txn.amount?.startsWith('+') ? '#10b981' : '#1e293b' }}>{txn.amount}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: txn.success ? '#10b981' : '#ef4444' }}></div>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: txn.success ? '#10b981' : '#ef4444', textTransform: 'uppercase' }}>
                      {txn.success ? 'Completed' : 'Failed'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          style={{ width: '100%', marginTop: '30px', padding: '18px', borderRadius: '22px', background: 'transparent', border: '1px solid #e2e8f0', color: '#94a3b8', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}
        >
          Show Older Transactions
        </motion.button>
      </div>
    </motion.div>
  );
};

export default History;