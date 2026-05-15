import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, ShieldCheck, HelpCircle, FileText, Share2, Star, MessageSquare, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const More = ({ user }) => {
  const navigate = useNavigate();

  const menuSections = [
    {
      title: 'Promotions & Rewards',
      items: [
        { icon: <Gift />, label: 'Refer & Earn', sub: 'Get ৳50 for every friend', color: '#ec4899' },
        { icon: <Star />, label: 'VIP Club', sub: 'Exclusive benefits for you', color: '#f59e0b' },
        { icon: <Zap />, label: 'Daily Offers', sub: 'Best deals today', color: '#6366f1' },
      ]
    },
    {
      title: 'Support & Info',
      items: [
        { icon: <MessageSquare />, label: 'Live Chat', sub: 'Talk to our agents', color: '#10b981' },
        { icon: <HelpCircle />, label: 'Help Center', sub: 'Common questions', color: '#06b6d4' },
        { icon: <FileText />, label: 'Terms & Privacy', sub: 'Our legal policies', color: '#64748b' },
        { icon: <Share2 />, label: 'Share App', sub: 'Invite your contacts', color: '#4f46e5' },
      ]
    }
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
        <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>More Services</h2>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {menuSections.map((section, sIdx) => (
          <div key={sIdx} style={{ marginBottom: '35px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '15px', marginLeft: '10px' }}>
              {section.title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {section.items.map((item, iIdx) => (
                <motion.div 
                  key={iIdx}
                  whileTap={{ scale: 0.98 }}
                  style={{ 
                    padding: '22px', background: 'white', borderRadius: '28px', border: '1px solid #f1f5f9',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.01)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '52px', height: '52px', borderRadius: '16px', 
                      background: `${item.color}10`, color: item.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {React.cloneElement(item.icon, { size: 24, strokeWidth: 2.5 })}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)' }}>{item.label}</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600', marginTop: '2px' }}>{item.sub}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} color="#cbd5e1" strokeWidth={3} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer Info */}
        <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#94a3b8', marginBottom: '10px' }}>
             <ShieldCheck size={18} />
             <span style={{ fontSize: '12px', fontWeight: '700' }}>Version 2.0.1 (Premium)</span>
           </div>
           <p style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '600' }}>© 2026 Digital Pay Solutions. All rights reserved.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default More;
