import { useState } from "react";
import AdminLogin from "../components/AdminLogin";
import AdminPanel from "../components/AdminPanel";

export default function Admin() {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("adminToken"));
    return loggedIn
        ? <AdminPanel />
        : <AdminLogin onLogin={() => setLoggedIn(true)} />;
}