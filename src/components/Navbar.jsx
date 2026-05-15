import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CreditCard, History, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/' },
    { icon: <CreditCard size={24} />, label: 'Cards', path: '/cards' },
    { icon: <History size={24} />, label: 'History', path: '/history' },
    { icon: <User size={24} />, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="navbar">
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <motion.div
                whileTap={{ scale: 0.8 }}
                style={{ 
                  position: 'relative', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    style={{
                      position: 'absolute',
                      top: '-15px',
                      width: '40px',
                      height: '40px',
                      background: 'var(--primary-glow)',
                      borderRadius: '50%',
                      filter: 'blur(10px)',
                      zIndex: -1
                    }}
                  />
                )}
                <div style={{ color: isActive ? 'var(--primary)' : 'var(--text-dim)', transition: 'color 0.3s' }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: '11px', fontWeight: '800' }}>{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="nav-dot"
                    style={{ width: '5px', height: '5px', background: 'var(--primary)', borderRadius: '50%', marginTop: '2px' }}
                  />
                )}
              </motion.div>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;
