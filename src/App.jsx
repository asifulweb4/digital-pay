import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
import Recharge from './components/Recharge';
import BillPay from './components/BillPay';
import AddMoney from './components/AddMoney';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import RegularPack from './components/RegularPack';
import SendMoney from './components/SendMoney';
import Cards from './components/Cards';
import History from './components/History';
import More from './components/More';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000');

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initApp = async () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        // অ্যাপ খুললে সাইলেন্টলি ডাটাবেস থেকে রিয়েল ব্যালেন্স আনা
        try {
          const response = await axios.get(`${API_URL}/api/user/${parsedUser.email}`);
          if (response.data) {
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        } catch (error) {
          console.log("Offline mode: using cached balance");
        }
      }
      setTimeout(() => setLoading(false), 2000);
    };
    initApp();
  }, []);

  const handleUpdateBalance = (newBalance) => {
    setUser(prev => ({ ...prev, balance: newBalance }));
  };

  if (loading) return <SplashScreen />;

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={setUser} /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register onRegister={setUser} /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/recharge" element={user ? <Recharge user={user} onUpdateBalance={handleUpdateBalance} /> : <Navigate to="/login" />} />
          <Route path="/bill-pay" element={user ? <BillPay user={user} onUpdateBalance={handleUpdateBalance} /> : <Navigate to="/login" />} />
          <Route path="/add-money" element={user ? <AddMoney user={user} onUpdateBalance={handleUpdateBalance} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile user={user} onLogout={() => { localStorage.removeItem('user'); setUser(null); }} /> : <Navigate to="/login" />} />
          <Route path="/regular-pack" element={user ? <RegularPack user={user} /> : <Navigate to="/login" />} />
          <Route path="/send" element={user ? <SendMoney user={user} onUpdateBalance={handleUpdateBalance} /> : <Navigate to="/login" />} />
          <Route path="/cards" element={user ? <Cards user={user} /> : <Navigate to="/login" />} />
          <Route path="/history" element={user ? <History user={user} /> : <Navigate to="/login" />} />
          <Route path="/more" element={user ? <More user={user} /> : <Navigate to="/login" />} />
        </Routes>
        {user && <Navbar />}
      </div>
    </Router>
  );
}

const SplashScreen = () => (
  <div className="splash-screen" style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div style={{ 
        width: '120px', height: '120px', 
        background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)', 
        borderRadius: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        boxShadow: '0 20px 40px rgba(79, 70, 229, 0.3)',
        marginBottom: '30px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '60px', height: '60px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}></div>
        <h1 style={{ color: 'white', fontSize: '50px', fontWeight: '900' }}>৳</h1>
      </div>
      <h2 className="logo-text" style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '4px' }}>DIGITAL PAY</h2>
      <div style={{ marginTop: '40px', width: '40px', height: '4px', background: 'var(--primary-glow)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
        <motion.div 
          animate={{ x: [-40, 40] }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ position: 'absolute', width: '20px', height: '100%', background: 'var(--primary)', borderRadius: '2px' }}
        />
      </div>
    </motion.div>
  </div>
);

export default App;