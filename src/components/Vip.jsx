import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, ShieldCheck, Zap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Vip = () => {
    const navigate = useNavigate();
    const benefits = [
        { icon: <Zap size={20} color="#d97706" />, title: '0% Cash-out Fee', desc: 'VIP মেম্বারদের জন্য যেকোনো ক্যাশআউট সম্পূর্ণ ফ্রি।' },
        { icon: <ShieldCheck size={20} color="#d97706" />, title: 'Priority Support', desc: 'যেকোনো প্রয়োজনে ১ মিনিটের মধ্যে লাইভ কাস্টমার কেয়ার।' },
        { icon: <Star size={20} color="#d97706" />, title: 'Unlimited Limits', desc: 'দৈনিক লেনদেনের কোনো সর্বোচ্চ সীমাবদ্ধতা নেই।' }
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#f8fafc', minHeight: '100vh', padding: '24px', color: '#1e293b' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}><ArrowLeft size={18} /> Back</button>

            <div style={{ maxWidth: '550px', margin: '40px auto 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ width: '90px', height: '90px', background: '#fffbeb', color: '#d97706', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', boxShadow: '0 10px 20px rgba(217,119,6,0.05)' }}><Crown size={44} /></div>
                    <h2 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.5px' }}>Digital Pay VIP Club</h2>
                    <p style={{ color: '#64748b', marginTop: '8px', fontWeight: '600' }}>স্বাগতম এলিট ক্লাবে! একজন প্রিমিয়াম মেম্বার হিসেবে উপভোগ করুন বিশেষ সুবিধাসমূহ।</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {benefits.map((b, i) => (
                        <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '22px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'start', boxShadow: '0 10px 25px rgba(0,0,0,0.01)' }}>
                            <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '14px' }}>{b.icon}</div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#1e293b' }}>{b.title}</h4>
                                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b', fontWeight: '600', lineHeight: '1.4' }}>{b.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Vip;