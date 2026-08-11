import axios from "axios";
import { UserPlus } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthShell from "./AuthShell";

export default function RegisterPage() {
  const { user, register } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm_password: "" });
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  if (user) return <Navigate to="/" replace/>;
  const submit = async (event: SyntheticEvent<HTMLFormElement>) => { event.preventDefault(); setBusy(true); setError(""); try { await register({ ...form, role: "user" }); navigate("/"); } catch (err) { const data = axios.isAxiosError(err) ? err.response?.data : null; setError(data ? Object.values(data).flat().join(" ") : "Unable to create account."); } finally { setBusy(false); } };
  const change = (key: keyof typeof form, value: string) => setForm({...form, [key]: value});
  return <AuthShell><div className="auth-card"><span className="eyebrow">Join the platform</span><h2>Create your account</h2><p>Start exploring verified properties and projects.</p>{error && <div className="form-error">{error}</div>}<form onSubmit={submit}>
    <label>Full name<input value={form.name} onChange={e=>change("name",e.target.value)} required placeholder="Your full name"/></label>
    <label>Email address<input type="email" value={form.email} onChange={e=>change("email",e.target.value)} required placeholder="you@example.com"/></label>
    <div className="form-two"><label>Password<input type="password" value={form.password} onChange={e=>change("password",e.target.value)} required placeholder="Minimum 8 characters"/></label><label>Confirm password<input type="password" value={form.confirm_password} onChange={e=>change("confirm_password",e.target.value)} required placeholder="Repeat password"/></label></div>
    <button className="primary-button" disabled={busy}><UserPlus/>{busy ? "Creating..." : "Create account"}</button>
  </form><p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p></div></AuthShell>;
}
