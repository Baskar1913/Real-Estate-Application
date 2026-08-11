import axios from "axios";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthShell from "./AuthShell";

export default function LoginPage() {
  const { user, login } = useAuth(); const navigate = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [show, setShow] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  if (user) return <Navigate to="/" replace/>;
  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError("");
    try { await login({ email, password, role: "user" }); navigate("/", { replace: true }); }
    catch (err) { setError(axios.isAxiosError(err) ? err.response?.data?.message || "Invalid email or password." : "Unable to sign in."); }
    finally { setBusy(false); }
  };
  return <AuthShell><div className="auth-card"><span className="eyebrow">Welcome back</span><h2>Sign in to continue</h2><p>Access your personalized property portal.</p>{error && <div className="form-error">{error}</div>}<form onSubmit={submit}>
    <label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email"/></label>
    <label><span className="label-row">Password<Link to="/forgot-password">Forgot password?</Link></span><span className="password-wrap"><input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required autoComplete="current-password"/><button type="button" onClick={() => setShow(!show)}>{show ? <EyeOff/> : <Eye/>}</button></span></label>
    <button className="primary-button" disabled={busy}><LogIn/>{busy ? "Signing in..." : "Sign in"}</button>
  </form><p className="auth-switch">New here? <Link to="/register">Create an account</Link></p></div></AuthShell>;
}
