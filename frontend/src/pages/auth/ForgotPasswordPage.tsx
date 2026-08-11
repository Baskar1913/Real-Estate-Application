import { Mail } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { forgotRequest } from "../../services/auth";
import AuthShell from "./AuthShell";

export default function ForgotPasswordPage() {
  const [email,setEmail]=useState(""); const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false);
  const submit=async(e:SyntheticEvent<HTMLFormElement>)=>{e.preventDefault();setBusy(true);try{setMessage((await forgotRequest(email)).message);}finally{setBusy(false);}};
  return <AuthShell><div className="auth-card"><span className="eyebrow">Account recovery</span><h2>Forgot your password?</h2><p>Enter your registered email to generate a secure reset link.</p>{message&&<div className="form-success">{message}</div>}<form onSubmit={submit}><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com"/></label><button className="primary-button" disabled={busy}><Mail/>{busy?"Generating...":"Send reset link"}</button></form><p className="auth-switch"><Link to="/login">Back to sign in</Link></p></div></AuthShell>;
}

