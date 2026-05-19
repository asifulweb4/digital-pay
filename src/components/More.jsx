import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, ShieldCheck, HelpCircle, FileText, Share2, Star, MessageSquare, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const More = ({ user }) => {
  const navigate = useNavigate();

  const handleAction = (label) => {
    switch (label) {
      case 'Live Chat':
        window.open('https://wa.me/message/2WPWBDMISBSGL1', '_blank');
        break;
      case 'Refer & Earn':
        navigate('/refer');
        break;
      case 'VIP Club':
        navigate('/vip');
        break;
      case 'Daily Offers':
        navigate('/offers');
        break;
      case 'Help Center':
        navigate('/help');
        break;
      case 'Terms & Privacy':
        navigate('/terms');
        break;
      case 'Share App':
        if (navigator.share) {
          navigator.share({
            title: 'Digital Pay',
            text: 'Check out this awesome payment app!',
            url: window.location.origin,
          }).catch(() => { });
        } else {
          navigator.clipboard.writeText(window.location.origin);
          alert('App link copied to clipboard!');
        }
        break;
      default:
        break;
    }
  };

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
        {
          icon: <MessageSquare />,
          label: 'Live Chat',
          sub: 'Talk to our agents',
          color: '#25D366',
          badge: 'WhatsApp'
        },
        { icon: <HelpCircle />, label: 'Help Center', sub: 'Common questions', color: '#06b6d4' },
        { icon: <FileText />, label: 'Terms & Privacy', sub: 'Our legal policies', color: '#64748b' },
        { icon: <Share2 />, label: 'Share App', sub: 'Invite your contacts', color: '#4f46e5' },
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '20px', paddingBottom: '120px', background: '#f8fafc', minHeight: '100vh' }}
    >
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
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.01, boxShadow: `0 8px 25px ${item.color}20` }}
                  onClick={() => handleAction(item.label)}
                  style={{
                    padding: '22px',
                    background: 'white',
                    borderRadius: '28px',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '16px',
                      background: `${item.color}15`, color: item.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {React.cloneElement(item.icon, { size: 24, strokeWidth: 2.5 })}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)' }}>{item.label}</h4>
                        {item.badge && (
                          <span style={{
                            fontSize: '10px',
                            fontWeight: '800',
                            color: '#25D366',
                            background: '#25D36615',
                            border: '1px solid #25D36630',
                            borderRadius: '8px',
                            padding: '2px 7px',
                            letterSpacing: '0.3px'
                          }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600', marginTop: '2px' }}>{item.sub}</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  >
                    <ChevronRight size={20} color={item.color} strokeWidth={3} style={{ opacity: 0.5 }} />
                  </motion.div>
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