import { KeyRound } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetRequest } from "../../services/auth";
import AuthShell from "./AuthShell";

export default function ResetPasswordPage(){const[params]=useSearchParams();const[password,setPassword]=useState("");const[confirm,setConfirm]=useState("");const[msg,setMsg]=useState("");const[error,setError]=useState("");const submit=async(e:SyntheticEvent<HTMLFormElement>)=>{e.preventDefault();setError("");try{setMsg((await resetRequest({uid:params.get("uid")||"",token:params.get("token")||"",password,confirm_password:confirm})).message);}catch{setError("The reset link is invalid, expired, or the passwords are not accepted.");}};return <AuthShell><div className="auth-card"><span className="eyebrow">Secure password reset</span><h2>Choose a new password</h2><p>Use a strong password that you do not use elsewhere.</p>{msg&&<div className="form-success">{msg}</div>}{error&&<div className="form-error">{error}</div>}<form onSubmit={submit}><label>New password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><label>Confirm password<input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required/></label><button className="primary-button"><KeyRound/>Reset password</button></form>{msg&&<p className="auth-switch"><Link to="/login">Continue to sign in</Link></p>}</div></AuthShell>}

