import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, HelpCircle, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Help = () => {
    const navigate = useNavigate();

    // হোয়াটসঅ্যাপ চ্যাট ওপেন করার ফাংশন
    const handleLiveChat = () => {
        window.open('https://wa.me/message/2WPWBDMISBSGL1', '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ background: '#f8fafc', minHeight: '100vh', padding: '24px', color: '#1e293b' }}
        >
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                style={{ background: 'white', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}
            >
                <ArrowLeft size={18} /> Back
            </button>

            <div style={{ maxWidth: '550px', margin: '30px auto 0' }}>
                <h2 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.5px' }}>Help & Support Center</h2>
                <p style={{ color: '#64748b', fontWeight: '600', marginTop: '4px', fontSize: '14px' }}>যেকোনো প্রয়োজনে আমাদের সাপোর্ট টিম ২৪ ঘণ্টা আপনার পাশে আছে।</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '30px' }}>

                    {/* FAQ Card */}
                    <div style={{ background: 'white', padding: '22px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.01)' }}>
                        <HelpCircle size={24} color="#1e40af" />
                        <div>
                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '900' }}>Frequently Asked Questions (FAQ)</h4>
                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>সাধারণ সমস্যাগুলোর তাত্ক্ষণিক গাইডলাইন এবং সমাধান জানুন।</p>
                        </div>
                    </div>

                    {/* 🚀 Clickable Live Chat Support Card */}
                    <motion.div
                        onClick={handleLiveChat}
                        whileHover={{ scale: 1.02, backgroundColor: '#e0f2fe' }} // হোভার করলে হালকা নীল হবে এবং সামান্য বড় হবে
                        whileTap={{ scale: 0.98 }}
                        style={{
                            background: '#eff6ff',
                            padding: '22px',
                            borderRadius: '24px',
                            border: '1px solid #bfdbfe',
                            display: 'flex',
                            gap: '16px',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease'
                        }}
                    >
                        <div style={{ color: '#1e40af' }}>
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#1e40af' }}>Live Chat Support</h4>
                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#1e40af', fontWeight: '600', opacity: 0.85 }}>আমাদের কাস্টমার কেয়ার প্রতিনিধির সাথে সরাসরি মেসেজে কথা বলুন।</p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </motion.div>
    );
};

export default Help;