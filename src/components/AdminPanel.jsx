import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("adminToken");

const apiFetch = (path, options = {}) =>
    fetch(`${API}/api/admin${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "x-admin-token": getToken(),
            ...(options.headers || {}),
        },
    }).then((r) => r.json());

export default function AdminPanel() {
    const [tab, setTab] = useState("dashboard");
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [search, setSearch] = useState("");

    const showToast = (msg, type = "ok") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadAll = async () => {
        setLoading(true);
        try {
            const [s, u, t] = await Promise.all([
                apiFetch("/stats"),
                apiFetch("/users"),
                apiFetch("/transactions"),
            ]);
            if (s.success) setStats(s);
            if (u.success) setUsers(u.users);
            if (t.success) setTransactions(t.transactions);
        } catch {
            showToast("ডেটা লোড করতে সমস্যা হয়েছে", "err");
        }
        setLoading(false);
    };

    useEffect(() => { loadAll(); }, []);

    const deleteUser = async (id, name) => {
        if (!confirm(`"${name}" কে ডিলিট করতে চান? তার সব লেনদেনও মুছে যাবে!`)) return;
        const r = await apiFetch(`/users/${id}`, { method: "DELETE" });
        if (r.success) { showToast("ইউজার ডিলিট হয়েছে"); loadAll(); }
        else showToast(r.message, "err");
    };

    const adjustBalance = async (userId, amount) => {
        if (!amount || isNaN(amount)) return showToast("সঠিক পরিমাণ দিন", "err");
        const r = await apiFetch("/adjust-balance", {
            method: "POST",
            body: JSON.stringify({ userId, amount: parseFloat(amount) }),
        });
        if (r.success) { showToast(`ব্যালেন্স আপডেট হয়েছে। নতুন: ৳${parseFloat(r.newBalance).toFixed(2)}`); loadAll(); }
        else showToast(r.message, "err");
    };

    const txLabel = (type) => ({
        add_money: { label: "টাকা জমা", color: "#a78bfa" },
        receive: { label: "প্রাপ্তি", color: "#c084fc" },
        send_money: { label: "পাঠানো", color: "#f472b6" },
        recharge: { label: "রিচার্জ", color: "#e879f9" },
        bill_pay: { label: "বিল পরিশোধ", color: "#a855f7" },
        admin_adjust: { label: "অ্যাডমিন সামঞ্জস্য", color: "#f9a8d4" },
    }[type] || { label: type, color: "#94a3b8" });

    const filteredUsers = users.filter(
        (u) =>
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.phone?.includes(search)
    );

    const filteredTx = transactions.filter(
        (t) =>
            t.user_name?.toLowerCase().includes(search.toLowerCase()) ||
            t.user_email?.toLowerCase().includes(search.toLowerCase())
    );

    const tabs = [
        { id: "dashboard", icon: "📊", label: "ড্যাশবোর্ড" },
        { id: "users", icon: "👥", label: "ইউজার" },
        { id: "transactions", icon: "💸", label: "লেনদেন" },
    ];

    return (
        <div style={S.root}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #1a0533; }
        ::-webkit-scrollbar-thumb { background: #7c3aed; border-radius: 3px; }
        input::placeholder { color: #6b21a8; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px #a855f733} 50%{box-shadow:0 0 40px #a855f766} }
        tr:hover td { background: #2d0a4e44 !important; transition: background 0.2s; }
      `}</style>

            {/* Sidebar */}
            <aside style={S.sidebar}>
                {/* Decorative blobs */}
                <div style={S.blob1} />
                <div style={S.blob2} />

                <div style={S.logo}>
                    <div style={S.logoCircle}>⚡</div>
                    <div>
                        <div style={S.logoName}>DigitalPay</div>
                        <div style={S.logoTag}>অ্যাডমিন প্যানেল</div>
                    </div>
                </div>

                <nav style={{ padding: "0 10px", flex: 1 }}>
                    {tabs.map((t) => (
                        <button key={t.id} onClick={() => { setTab(t.id); setSearch(""); }} style={{
                            ...S.navBtn, ...(tab === t.id ? S.navActive : {}),
                        }}>
                            <span style={{ fontSize: 18 }}>{t.icon}</span>
                            <span>{t.label}</span>
                            {tab === t.id && <div style={S.navDot} />}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={() => { localStorage.removeItem("adminToken"); window.location.reload(); }}
                    style={S.logoutBtn}
                >
                    🚪 লগআউট
                </button>
            </aside>

            {/* Main */}
            <main style={S.main}>
                {/* Mesh background */}
                <div style={S.meshBg} />

                {/* Header */}
                <div style={S.header}>
                    <div>
                        <h2 style={S.pageTitle}>
                            {tab === "dashboard" && "সামগ্রিক পর্যালোচনা"}
                            {tab === "users" && `সকল ইউজার (${users.length} জন)`}
                            {tab === "transactions" && `সকল লেনদেন (${transactions.length}টি)`}
                        </h2>
                        <p style={S.pageDate}>
                            {new Date().toLocaleDateString("bn-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", position: "relative", zIndex: 1 }}>
                        {(tab === "users" || tab === "transactions") && (
                            <input
                                placeholder="🔍 খুঁজুন..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={S.searchInput}
                            />
                        )}
                        <button onClick={loadAll} style={S.refreshBtn}>🔄 রিফ্রেশ</button>
                    </div>
                </div>

                {/* Toast */}
                {toast && (
                    <div style={{ ...S.toast, background: toast.type === "err" ? "linear-gradient(135deg,#be123c,#9f1239)" : "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
                        {toast.msg}
                    </div>
                )}

                {loading ? (
                    <div style={S.loadBox}>
                        <div style={S.spinner} />
                        <p style={{ color: "#a78bfa", marginTop: 14, fontFamily: "Hind Siliguri" }}>ডেটাবেস থেকে লোড হচ্ছে...</p>
                    </div>
                ) : (
                    <>
                        {tab === "dashboard" && stats && (
                            <div>
                                <div style={S.statsGrid}>
                                    <StatCard icon="👥" label="মোট ইউজার" value={`${stats.totalUsers} জন`} accent="#a855f7" grad="linear-gradient(135deg,#581c87,#3b0764)" />
                                    <StatCard icon="💰" label="মোট ব্যালেন্স" value={`৳${parseFloat(stats.totalBalance).toLocaleString("bn-BD", { minimumFractionDigits: 2 })}`} accent="#ec4899" grad="linear-gradient(135deg,#831843,#500724)" />
                                    <StatCard icon="📋" label="মোট লেনদেন" value={`${stats.totalTransactions}টি`} accent="#c084fc" grad="linear-gradient(135deg,#4a1d96,#2e1065)" />
                                    <StatCard icon="📥" label="মোট জমা" value={`৳${parseFloat(stats.totalAdded).toLocaleString("bn-BD", { minimumFractionDigits: 2 })}`} accent="#f472b6" grad="linear-gradient(135deg,#9d174d,#701a75)" />
                                </div>
                                <div style={S.card}>
                                    <h3 style={S.cardTitle}>🕐 সাম্প্রতিক লেনদেন</h3>
                                    <TxTable rows={transactions.slice(0, 8)} txLabel={txLabel} />
                                </div>
                            </div>
                        )}

                        {tab === "users" && (
                            <div style={S.card}>
                                <div style={S.tableWrap}>
                                    <table style={S.table}>
                                        <thead>
                                            <tr>
                                                {["#", "নাম", "ইমেইল", "ফোন", "ব্যালেন্স", "ব্যালেন্স সামঞ্জস্য", "অ্যাকশন"].map(h => (
                                                    <th key={h} style={S.th}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map((u, i) => (
                                                <UserRow key={u.id} user={u} index={i + 1} onDelete={deleteUser} onAdjust={adjustBalance} />
                                            ))}
                                            {filteredUsers.length === 0 && (
                                                <tr><td colSpan={7} style={S.emptyCell}>কোনো ইউজার পাওয়া যায়নি</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {tab === "transactions" && (
                            <div style={S.card}>
                                <div style={S.tableWrap}>
                                    <TxTable rows={filteredTx} txLabel={txLabel} showUser />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

function StatCard({ icon, label, value, accent, grad }) {
    return (
        <div style={{ ...S.statCard, background: grad, border: `1px solid ${accent}44` }}>
            <div style={{ ...S.statIcon, background: accent + "33", color: accent }}>{icon}</div>
            <div style={S.statVal}>{value}</div>
            <div style={{ ...S.statLabel, color: accent + "cc" }}>{label}</div>
            <div style={{ ...S.statGlow, background: accent }} />
        </div>
    );
}

function UserRow({ user, index, onDelete, onAdjust }) {
    const [amt, setAmt] = useState("");
    return (
        <tr>
            <td style={S.td}><span style={S.idx}>{index}</span></td>
            <td style={S.td}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={S.avatar}>{(user.name || "?")[0].toUpperCase()}</div>
                    <span style={{ color: "#f3e8ff", fontWeight: 600 }}>{user.name}</span>
                </div>
            </td>
            <td style={S.td}><span style={S.muted}>{user.email}</span></td>
            <td style={S.td}><span style={S.muted}>{user.phone}</span></td>
            <td style={S.td}>
                <span style={{ color: "#c084fc", fontWeight: 700, fontSize: 15 }}>
                    ৳{parseFloat(user.balance || 0).toLocaleString("bn-BD", { minimumFractionDigits: 2 })}
                </span>
            </td>
            <td style={S.td}>
                <div style={{ display: "flex", gap: 6 }}>
                    <input
                        type="number"
                        placeholder="যোগ/বিয়োগ"
                        value={amt}
                        onChange={e => setAmt(e.target.value)}
                        style={S.adjInput}
                    />
                    <button onClick={() => { onAdjust(user.id, amt); setAmt(""); }} style={S.btnPurple}>
                        ঠিক করুন
                    </button>
                </div>
            </td>
            <td style={S.td}>
                <button onClick={() => onDelete(user.id, user.name)} style={S.btnRed}>
                    🗑 ডিলিট
                </button>
            </td>
        </tr>
    );
}

function TxTable({ rows, txLabel, showUser }) {
    return (
        <table style={S.table}>
            <thead>
                <tr>
                    {["#", showUser && "ইউজার", "ধরন", "পরিমাণ", "বিবরণ", "তারিখ"].filter(Boolean).map(h => (
                        <th key={h} style={S.th}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((tx, i) => {
                    const { label, color } = txLabel(tx.type);
                    return (
                        <tr key={tx.id}>
                            <td style={S.td}><span style={S.idx}>{i + 1}</span></td>
                            {showUser && (
                                <td style={S.td}>
                                    <div>
                                        <div style={{ color: "#f3e8ff", fontWeight: 600 }}>{tx.user_name || "—"}</div>
                                        <div style={{ color: "#7c3aed", fontSize: 11 }}>{tx.user_email}</div>
                                    </div>
                                </td>
                            )}
                            <td style={S.td}>
                                <span style={{ ...S.badge, background: color + "22", color, border: `1px solid ${color}44` }}>{label}</span>
                            </td>
                            <td style={S.td}>
                                <span style={{ color: "#f3e8ff", fontWeight: 700 }}>
                                    ৳{parseFloat(tx.amount || 0).toLocaleString("bn-BD", { minimumFractionDigits: 2 })}
                                </span>
                            </td>
                            <td style={S.td}><span style={S.muted}>{tx.description || "—"}</span></td>
                            <td style={S.td}>
                                <span style={S.muted}>
                                    {tx.created_at
                                        ? new Date(tx.created_at).toLocaleString("bn-BD", { dateStyle: "short", timeStyle: "short" })
                                        : "—"}
                                </span>
                            </td>
                        </tr>
                    );
                })}
                {rows.length === 0 && (
                    <tr><td colSpan={6} style={S.emptyCell}>কোনো লেনদেন পাওয়া যায়নি</td></tr>
                )}
            </tbody>
        </table>
    );
}

const S = {
    root: {
        display: "flex", minHeight: "100vh",
        background: "linear-gradient(135deg, #0d0015 0%, #1a0533 50%, #0d0015 100%)",
        fontFamily: "'Hind Siliguri', sans-serif", color: "#e9d5ff",
    },
    sidebar: {
        width: 230, background: "linear-gradient(180deg,#1e0040 0%,#0d001a 100%)",
        borderRight: "1px solid #7c3aed33",
        display: "flex", flexDirection: "column", padding: "20px 0",
        position: "sticky", top: 0, height: "100vh", overflow: "hidden",
    },
    blob1: {
        position: "absolute", width: 150, height: 150, borderRadius: "50%",
        background: "radial-gradient(circle,#7c3aed44,transparent)",
        top: -40, left: -40, pointerEvents: "none",
    },
    blob2: {
        position: "absolute", width: 100, height: 100, borderRadius: "50%",
        background: "radial-gradient(circle,#ec489944,transparent)",
        bottom: 60, right: -20, pointerEvents: "none",
    },
    logo: {
        display: "flex", alignItems: "center", gap: 12,
        padding: "0 18px 20px", borderBottom: "1px solid #7c3aed33",
        marginBottom: 12, position: "relative", zIndex: 1,
    },
    logoCircle: {
        width: 42, height: 42, borderRadius: 12,
        background: "linear-gradient(135deg,#a855f7,#ec4899)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, boxShadow: "0 4px 20px #a855f766",
    },
    logoName: { fontWeight: 800, fontSize: 15, color: "#f3e8ff" },
    logoTag: { fontSize: 11, color: "#7c3aed" },
    navBtn: {
        display: "flex", alignItems: "center", gap: 10, width: "100%",
        padding: "12px 14px", border: "none", borderRadius: 12,
        background: "transparent", color: "#7c3aed", cursor: "pointer",
        fontSize: 14, fontFamily: "inherit", marginBottom: 4,
        transition: "all 0.2s", position: "relative", zIndex: 1,
    },
    navActive: {
        background: "linear-gradient(135deg,#7c3aed22,#ec489922)",
        color: "#f3e8ff", fontWeight: 700,
        border: "1px solid #a855f744",
        boxShadow: "0 0 20px #a855f722",
    },
    navDot: {
        width: 6, height: 6, borderRadius: "50%",
        background: "#ec4899", marginLeft: "auto",
        boxShadow: "0 0 8px #ec4899",
    },
    logoutBtn: {
        margin: "10px 12px 0", padding: "11px 14px", border: "1px solid #be123c44",
        borderRadius: 12, background: "#be123c11", color: "#f472b6",
        cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600,
        position: "relative", zIndex: 1,
    },
    main: { flex: 1, padding: 28, overflowY: "auto", position: "relative" },
    meshBg: {
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 20% 20%,#4c1d9511 0%,transparent 50%), radial-gradient(ellipse at 80% 80%,#be185d11 0%,transparent 50%)",
    },
    header: {
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        marginBottom: 24, position: "relative", zIndex: 1,
    },
    pageTitle: {
        fontSize: 24, fontWeight: 800,
        background: "linear-gradient(135deg,#c084fc,#f472b6)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    },
    pageDate: { color: "#6d28d9", fontSize: 13, marginTop: 4 },
    searchInput: {
        padding: "9px 14px", borderRadius: 10,
        background: "#1e004033", border: "1px solid #7c3aed44",
        color: "#e9d5ff", fontSize: 13, fontFamily: "inherit", width: 220,
        outline: "none",
    },
    refreshBtn: {
        padding: "9px 16px", borderRadius: 10,
        background: "linear-gradient(135deg,#7c3aed22,#ec489922)",
        border: "1px solid #a855f744", color: "#c084fc",
        cursor: "pointer", fontSize: 13, fontFamily: "inherit",
    },
    toast: {
        position: "fixed", top: 20, right: 20, padding: "12px 22px",
        borderRadius: 12, color: "#fff", fontWeight: 600, zIndex: 9999,
        boxShadow: "0 8px 32px #a855f766", animation: "fadeIn 0.25s ease",
    },
    loadBox: {
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", height: "60vh", position: "relative", zIndex: 1,
    },
    spinner: {
        width: 44, height: 44, border: "3px solid #3b0764",
        borderTop: "3px solid #a855f7", borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
    },
    statsGrid: {
        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        gap: 16, marginBottom: 20, position: "relative", zIndex: 1,
    },
    statCard: {
        borderRadius: 18, padding: 22, position: "relative", overflow: "hidden",
    },
    statIcon: {
        width: 44, height: 44, borderRadius: 12, display: "flex",
        alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14,
    },
    statVal: { fontSize: 22, fontWeight: 800, color: "#f3e8ff", marginBottom: 4 },
    statLabel: { fontSize: 12, fontWeight: 600 },
    statGlow: {
        position: "absolute", bottom: -20, right: -20,
        width: 80, height: 80, borderRadius: "50%", opacity: 0.15, filter: "blur(20px)",
    },
    card: {
        background: "linear-gradient(135deg,#1e004044,#2d0a4e44)",
        borderRadius: 18, padding: 22,
        border: "1px solid #7c3aed33",
        backdropFilter: "blur(10px)",
        position: "relative", zIndex: 1,
    },
    cardTitle: { fontSize: 15, fontWeight: 700, color: "#e9d5ff", marginBottom: 16 },
    tableWrap: { overflowX: "auto" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
        textAlign: "left", padding: "10px 14px",
        background: "#1e004066",
        color: "#7c3aed", fontSize: 12, fontWeight: 700,
        borderBottom: "1px solid #7c3aed33", whiteSpace: "nowrap",
    },
    td: { padding: "13px 14px", color: "#a78bfa", fontSize: 13, verticalAlign: "middle" },
    emptyCell: { textAlign: "center", padding: 40, color: "#4c1d95" },
    idx: {
        width: 26, height: 26, borderRadius: 6,
        background: "#3b076444", border: "1px solid #7c3aed33",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, color: "#a78bfa", fontWeight: 700,
    },
    avatar: {
        width: 34, height: 34, borderRadius: "50%",
        background: "linear-gradient(135deg,#7c3aed,#ec4899)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, color: "#fff", fontSize: 14,
        boxShadow: "0 2px 10px #a855f744",
    },
    muted: { color: "#6d28d9", fontSize: 12 },
    badge: {
        padding: "4px 10px", borderRadius: 20,
        fontSize: 12, fontWeight: 700,
    },
    adjInput: {
        width: 100, padding: "7px 10px", borderRadius: 8,
        background: "#1e004033", border: "1px solid #7c3aed44",
        color: "#e9d5ff", fontSize: 12, fontFamily: "inherit", outline: "none",
    },
    btnPurple: {
        padding: "7px 12px", borderRadius: 8, border: "1px solid #7c3aed44",
        background: "linear-gradient(135deg,#7c3aed22,#a855f722)",
        color: "#c084fc", cursor: "pointer",
        fontSize: 12, fontFamily: "inherit", fontWeight: 600, whiteSpace: "nowrap",
    },
    btnRed: {
        padding: "7px 12px", borderRadius: 8, border: "1px solid #be123c44",
        background: "#be123c11", color: "#f472b6", cursor: "pointer",
        fontSize: 12, fontFamily: "inherit", fontWeight: 600,
    },
};