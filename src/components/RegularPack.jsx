import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Wifi, Phone, Package, Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Assets ইমপোর্ট
import airtelLogo from '../assets/airtel.png';
import blLogo from '../assets/bl.png';
import gpLogo from '../assets/gp.png';
import robiLogo from '../assets/robi.png';
import teletalkLogo from '../assets/teletalk.png';
import skittoLogo from '../assets/skitto.png';
import brilliantLogo from '../assets/brilliant.png';

const RegularPack = ({ user }) => {
  const navigate = useNavigate();
  const [selectedOperator, setSelectedOperator] = useState('Banglalink');
  const [selectedTab, setSelectedTab] = useState('সব');
  const [searchQuery, setSearchQuery] = useState('');

  const operators = [
    { name: 'Banglalink', code: 'BL', icon: blLogo },
    { name: 'Grameenphone', code: 'GP', icon: gpLogo },
    { name: 'Robi', code: 'RB', icon: robiLogo },
    { name: 'Airtel', code: 'AT', icon: airtelLogo },
    { name: 'Teletalk', code: 'TT', icon: teletalkLogo },
    { name: 'Skitto', code: 'SK', icon: skittoLogo },
    { name: 'Brilliant', code: 'BT', icon: brilliantLogo }
  ];

  const tabs = [
    { name: 'সব', icon: <Package size={20} /> },
    { name: 'বান্ডেল', icon: <Package size={20} /> },
    { name: 'ডাটা', icon: <Wifi size={20} /> },
    { name: 'ভয়েস', icon: <Phone size={20} /> }
  ];

  const handlePackClick = (pack) => {
    if (parseFloat(pack.price) > user?.balance) {
      // ✅ Alert এর বদলে AddMoney page এ নিয়ে যাও
      navigate('/add-money', {
        state: {
          message: `৳${pack.price} প্যাক কিনতে আপনার balance পর্যাপ্ত নয়। টাকা যোগ করুন।`,
          requiredAmount: pack.price
        }
      });
      return;
    }

    // ✅ Balance থাকলে recharge page এ যাও
    navigate('/recharge', {
      state: {
        selectedAmount: pack.price,
        selectedOperator: pack.operator,
        selectedCode: pack.operatorCode,
        isPackage: true
      }
    });
  };

  const generatePacks = () => {
    const basePacks = [
      { title: '45 GB Internet', validity: '30 Days', price: 275, category: 'ডাটা' },
      { title: '60 GB Internet', validity: '30 Days', price: 411, category: 'ডাটা' },
      { title: '80 GB Internet', validity: '30 Days', price: 555, category: 'ডাটা' },

      { title: '500 Minutes', validity: '30 Days', price: 285, category: 'ভয়েস' },
      { title: '500 Minutes', validity: '30 Days', price: 295, category: 'ভয়েস' },
      { title: '700 Minutes', validity: '30 Days', price: 355, category: 'ভয়েস' },
      { title: '1080 Minutes', validity: '30 Days', price: 449, category: 'ভয়েস' },
      { title: '1600 Minutes', validity: '30 Days', price: 599, category: 'ভয়েস' },


      { title: '25GB + 250 Min', validity: '15 Days', price: 288, category: 'বান্ডেল' },
      { title: '35GB + 300 Min', validity: '30 Days', price: 345, category: 'বান্ডেল' },
      { title: '50GB + 600 Min', validity: '30 Days', price: 499, category: 'বান্ডেল' },
    ];

    let allPacks = [];
    operators.forEach((op, index) => {
      basePacks.forEach((pack, pIndex) => {
        const finalPrice = op.name === 'Banglalink' ? pack.price : pack.price - 3;
        allPacks.push({
          id: `${index}-${pIndex}`,
          ...pack,
          price: finalPrice.toString(),
          operator: op.name,
          operatorCode: op.code
        });
      });
    });
    return allPacks;
  };

  const allPacks = generatePacks();

  const filteredPacks = allPacks.filter(pack =>
    pack.operator === selectedOperator &&
    (selectedTab === 'সব' || pack.category === selectedTab) &&
    (pack.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '120px', background: '#f8fafc' }}>
      {/* Header Section */}
      <div style={{ position: 'sticky', top: 0, zHeader: 1000, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(30px)', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '25px 20px', gap: '20px' }}>
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
          <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Internet & Voice Packs</h2>
        </div>

        {/* Operator Selector */}
        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '0 20px 25px', scrollbarWidth: 'none' }}>
          {operators.map((op) => (
            <motion.div
              key={op.name}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedOperator(op.name)}
              style={{
                minWidth: '80px',
                height: '80px',
                borderRadius: '24px',
                background: selectedOperator === op.name ? 'white' : '#f1f5f9',
                border: `3px solid ${selectedOperator === op.name ? 'var(--primary)' : 'transparent'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: selectedOperator === op.name ? '0 10px 20px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <img
                src={op.icon}
                alt={op.name}
                style={{
                  width: '50px',
                  height: '50px',
                  objectFit: 'contain',
                  filter: selectedOperator === op.name ? 'none' : 'grayscale(0.3) opacity(0.8)'
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={22} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', strokeWidth: 3 }} />
            <input
              type="text"
              placeholder="Search best packs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', background: 'white', border: '2px solid #f1f5f9', borderRadius: '22px', padding: '18px 20px 18px 55px', color: 'var(--text-main)', fontSize: '16px', fontWeight: '800', outline: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '0 10px', gap: '10px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setSelectedTab(tab.name)}
              style={{
                flex: 1,
                padding: '16px 5px',
                border: 'none',
                background: 'none',
                fontSize: '15px',
                color: selectedTab === tab.name ? 'var(--primary)' : 'var(--text-dim)',
                fontWeight: '900',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer'
              }}
            >
              <span style={{ color: selectedTab === tab.name ? 'var(--primary)' : 'var(--text-dim)' }}>
                {tab.icon}
              </span>
              {tab.name}
              {selectedTab === tab.name && (
                <motion.div layoutId="activeTabPacks" style={{ position: 'absolute', bottom: 0, left: '25%', right: '25%', height: '5px', background: 'var(--primary)', borderRadius: '10px 10px 0 0' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Pack List */}
      <div style={{ padding: '25px 20px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedOperator + selectedTab + searchQuery}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
          >
            {filteredPacks.length > 0 ? (
              filteredPacks.map((pack) => (
                <motion.div
                  key={pack.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handlePackClick(pack)}
                  style={{
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderRadius: '28px',
                    background: 'white',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '20px',
                      background: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #f1f5f9'
                    }}>
                      <img
                        src={operators.find(o => o.name === pack.operator)?.icon}
                        alt="op"
                        style={{ width: '42px', height: '42px', objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.3px' }}>{pack.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: '800', background: '#f1f5f9', padding: '4px 12px', borderRadius: '10px' }}>{pack.validity}</span>
                        <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '900', textTransform: 'uppercase' }}>{pack.category}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div>
                      <h3 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-main)' }}>৳{pack.price}</h3>
                      <p style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: '700', marginTop: '2px' }}>Tap to buy</p>
                    </div>
                    <div style={{ color: '#cbd5e1' }}>
                      <ChevronRight size={22} strokeWidth={3} />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '80px', color: '#cbd5e1' }}>
                <Package size={80} style={{ opacity: 0.2, marginBottom: '25px' }} />
                <h3 style={{ fontWeight: '900', color: 'var(--text-dim)' }}>No packs found</h3>
                <p style={{ fontSize: '15px', marginTop: '5px', fontWeight: '600' }}>Try a different keyword or operator.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RegularPack;