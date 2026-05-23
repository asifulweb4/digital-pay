import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!email || !password) return setError("সকল তথ্য পূরণ করুন");
        setLoading(true); setError("");
        try {
            const res = await fetch(`${API}/api/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            localStorage.setItem("adminToken", data.token);
            onLogin();
        } catch (e) {
            setError(e.message || "লগইন ব্যর্থ হয়েছে");
        }
        setLoading(false);
    };

    return (
        <div style={S.root}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        input::placeholder { color: #6d28d9; }
      `}</style>

            {/* Background orbs */}
            <div style={S.orb1} />
            <div style={S.orb2} />
            <div style={S.orb3} />

            <div style={S.card}>
                <div style={S.logoWrap}>
                    <div style={S.logoCircle}>⚡</div>
                    <h1 style={S.title}>DigitalPay</h1>
                    <p style={S.sub}>অ্যাডমিন প্যানেল লগইন</p>
                </div>

                {error && <div style={S.errBox}>{error}</div>}

                <div style={S.field}>
                    <label style={S.label}>ইমেইল</label>
                    <input
                        type="email" value={email} placeholder="admin@digitalpay.com"
                        onChange={e => setEmail(e.target.value)} style={S.input}
                    />
                </div>
                <div style={S.field}>
                    <label style={S.label}>পাসওয়ার্ড</label>
                    <input
                        type="password" value={password} placeholder="••••••••"
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleLogin()}
                        style={S.input}
                    />
                </div>
                <button onClick={handleLogin} disabled={loading} style={S.btn}>
                    {loading ? "লগইন হচ্ছে..." : "লগইন করুন →"}
                </button>
            </div>
        </div>
    );
}

const S = {
    root: {
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0d0015 0%,#1a0533 50%,#0d0015 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Hind Siliguri', sans-serif", position: "relative", overflow: "hidden",
    },
    orb1: {
        position: "fixed", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle,#7c3aed44,transparent)",
        top: -100, left: -100, animation: "pulse 4s ease infinite", pointerEvents: "none",
    },
    orb2: {
        position: "fixed", width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle,#ec489944,transparent)",
        bottom: -80, right: -80, animation: "pulse 5s ease infinite 1s", pointerEvents: "none",
    },
    orb3: {
        position: "fixed", width: 200, height: 200, borderRadius: "50%",
        background: "radial-gradient(circle,#a855f733,transparent)",
        top: "50%", left: "60%", animation: "pulse 6s ease infinite 2s", pointerEvents: "none",
    },
    card: {
        background: "linear-gradient(135deg,#1e004066,#2d0a4e66)",
        backdropFilter: "blur(20px)",
        borderRadius: 24, padding: "44px 38px",
        width: 390, border: "1px solid #7c3aed44",
        boxShadow: "0 20px 80px #a855f733",
        position: "relative", zIndex: 1,
    },
    logoWrap: { textAlign: "center", marginBottom: 30 },
    logoCircle: {
        width: 60, height: 60, borderRadius: 18, margin: "0 auto 14px",
        background: "linear-gradient(135deg,#a855f7,#ec4899)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 30, boxShadow: "0 8px 30px #a855f766",
        animation: "float 3s ease infinite",
    },
    title: { fontSize: 24, fontWeight: 800, color: "#f3e8ff", margin: 0 },
    sub: { color: "#7c3aed", fontSize: 13, marginTop: 6 },
    errBox: {
        background: "linear-gradient(135deg,#be123c22,#9f123922)",
        border: "1px solid #be123c44",
        color: "#fda4af", padding: "11px 16px",
        borderRadius: 10, fontSize: 13, marginBottom: 16, textAlign: "center",
    },
    field: { marginBottom: 16 },
    label: { display: "block", fontSize: 13, color: "#a78bfa", fontWeight: 600, marginBottom: 6 },
    input: {
        width: "100%", padding: "13px 16px", borderRadius: 12,
        background: "#1e004033", border: "1px solid #7c3aed44",
        color: "#f3e8ff", fontSize: 14, fontFamily: "inherit", outline: "none",
        transition: "border-color 0.2s",
    },
    btn: {
        width: "100%", padding: 15, borderRadius: 12, border: "none", marginTop: 10,
        background: "linear-gradient(135deg,#7c3aed,#ec4899)",
        color: "#fff", fontSize: 15, fontWeight: 700,
        cursor: "pointer", fontFamily: "inherit",
        boxShadow: "0 4px 20px #a855f766",
        transition: "opacity 0.2s",
    },
};