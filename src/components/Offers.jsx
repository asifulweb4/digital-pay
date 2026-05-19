import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Percent, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Offers = () => {
    const navigate = useNavigate();
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#f8fafc', minHeight: '100vh', padding: '24px', color: '#1e293b' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}><ArrowLeft size={18} /> Back</button>

            <div style={{ maxWidth: '550px', margin: '30px auto 0' }}>
                <h2 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.5px' }}>Hot Offers Today 🔥</h2>
                <p style={{ color: '#64748b', fontWeight: '600', marginTop: '4px', fontSize: '14px' }}>প্রতিদিন নতুন অফার লুফে নিন এবং ক্যাশব্যাক উপভোগ করুন।</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '30px' }}>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.01)' }}>
                        <div style={{ background: '#fef2f2', color: '#ef4444', padding: '14px', borderRadius: '16px' }}><Percent size={24} /></div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '900' }}>10% Instant Cashback</h4>
                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>যেকোনো বিদ্যুৎ বা গ্যাস বিল পেমেন্টে সর্বোচ্চ ৳১০০ সরাসরি ক্যাশব্যাক।</p>
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '20px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.01)' }}>
                        <div style={{ background: '#eff6ff', color: '#1e40af', padding: '14px', borderRadius: '16px' }}><Flame size={24} /></div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '900' }}>Add Money Bonus</h4>
                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>ব্যাংক বা কার্ড থেকে ৳১,০০০ অ্যাড মানি করলেই পাচ্ছেন ফ্রি ৳২৫ বোনাস!</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Offers;