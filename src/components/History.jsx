import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, Send, Landmark, Receipt, Search, Filter, ChevronRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History = ({ user }) => {
  const navigate = useNavigate();

  const transactions = [
    { id: 1, type: 'Recharge', title: 'Grameenphone Recharge', amount: '-৳500.00', date: 'Today, 12:30 PM', icon: <Smartphone />, color: '#f43f5e', success: true },
    { id: 2, type: 'Received', title: 'Money from 01784XXXXXX', amount: '+৳1,200.00', date: 'Yesterday, 08:15 PM', icon: <ArrowDownLeft />, color: '#10b981', success: true },
    { id: 3, type: 'Send', title: 'Sent to 01944XXXXXX', amount: '-৳2,000.00', date: '14 May, 03:45 PM', icon: <Send />, color: '#6366f1', success: true },
    { id: 4, type: 'Add Money', title: 'Added from bKash', amount: '+৳5,000.00', date: '12 May, 10:20 AM', icon: <Landmark />, color: '#06b6d4', success: true },
    { id: 5, type: 'Bill Pay', title: 'DESCO Bill Payment', amount: '-৳1,450.00', date: '10 May, 11:00 AM', icon: <Receipt />, color: '#f59e0b', success: false },
    { id: 6, type: 'Recharge', title: 'Robi Recharge', amount: '-৳99.00', date: '08 May, 09:12 AM', icon: <Smartphone />, color: '#f43f5e', success: true },
  ];

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
        <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Transactions</h2>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              style={{ width: '100%', padding: '15px 15px 15px 48px', borderRadius: '18px', border: '1px solid #f1f5f9', background: 'white', fontWeight: '600', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            style={{ width: '52px', height: '52px', borderRadius: '18px', background: 'white', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}
          >
            <Filter size={20} />
          </motion.button>
        </div>

        {/* Transaction List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {transactions.map((txn) => (
            <motion.div 
              key={txn.id}
              whileTap={{ scale: 0.98 }}
              style={{ 
                padding: '20px', 
                background: 'white', 
                borderRadius: '28px', 
                border: '1px solid #f1f5f9', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.01)'
              }}
            >
              <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
                <div style={{ 
                  width: '55px', height: '55px', borderRadius: '18px', 
                  background: `${txn.color}10`, color: txn.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {txn.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)' }}>{txn.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: '700', marginTop: '3px' }}>{txn.date}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h4 style={{ fontSize: '17px', fontWeight: '900', color: txn.amount.startsWith('+') ? '#10b981' : 'var(--text-main)' }}>{txn.amount}</h4>
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

        {/* Load More */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          style={{ width: '100%', marginTop: '30px', padding: '18px', borderRadius: '22px', background: 'transparent', border: '2px solid #f1f5f9', color: 'var(--text-dim)', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}
        >
          Show Older Transactions
        </motion.button>
      </div>
    </motion.div>
  );
};

export default History;
