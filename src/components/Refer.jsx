import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Refer = () => {
    const navigate = useNavigate();
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#f8fafc', minHeight: '100vh', padding: '24px', color: '#1e293b' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}><ArrowLeft size={18} /> Back</button>

            <div style={{ textAlign: 'center', marginTop: '60px', maxWidth: '500px', margin: '60px auto 0' }}>
                <div style={{ width: '90px', height: '90px', background: '#eff6ff', color: '#1e40af', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', boxShadow: '0 10px 20px rgba(30,64,175,0.05)' }}><Gift size={44} /></div>
                <h2 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.5px' }}>Refer & Earn Money</h2>
                <p style={{ color: '#64748b', marginTop: '10px', fontWeight: '600', fontSize: '15px', lineHeight: '1.5' }}>আপনার বন্ধুদের ইনভাইট করুন এবং প্রতি রেফারে জিতে নিন নিশ্চিত ৳৫০ বোনাস সরাসরি আপনার ওয়ালেটে!</p>

                <div style={{ background: 'white', border: '2px dashed #cbd5e1', padding: '22px', borderRadius: '24px', marginTop: '40px', fontWeight: '900', fontSize: '24px', letterSpacing: '3px', color: '#1e40af', boxShadow: '0 10px 25px rgba(0,0,0,0.01)' }}>DPAY-ASIFA89</div>

                <motion.button whileTap={{ scale: 0.95 }} style={{ background: '#1e40af', color: 'white', border: 'none', width: '100%', padding: '18px', borderRadius: '18px', fontWeight: '900', fontSize: '16px', marginTop: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 12px 25px rgba(30, 64, 175, 0.2)' }}><Share2 size={18} /> Share Referral Link</motion.button>
            </div>
        </motion.div>
    );
};

export default Refer;