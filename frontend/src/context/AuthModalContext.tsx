import axios from "axios";
import { Eye, EyeOff, KeyRound, LogIn, Mail, UserPlus, X } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import Swal from "sweetalert2";
import Brand from "../components/Brand";
import { forgotRequest } from "../services/auth";
import type { Role } from "../types";
import { useAuth } from "./AuthContext";

type AuthView = "login" | "register" | "forgot";

interface AuthModalValue {
  openLogin(role?: Role): void;
  openRegister(): void;
  openForgot(): void;
  closeAuth(): void;
}

const AuthModalContext = createContext<AuthModalValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<AuthView>("login");
  const [role, setRole] = useState<Role>("user");

  const show = (nextView: AuthView, nextRole: Role = "user") => {
    setView(nextView);
    setRole(nextRole);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const value: AuthModalValue = {
    openLogin: (selectedRole = "user") => show("login", selectedRole),
    openRegister: () => show("register"),
    openForgot: () => show("forgot"),
    closeAuth: () => setOpen(false),
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      {open && (
        <div
          className="auth-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section className="auth-modal" role="dialog" aria-modal="true">
            <button className="auth-modal-close" onClick={() => setOpen(false)} aria-label="Close">
              <X />
            </button>
            <Brand />
            {view === "login" && (
              <LoginForm role={role} setView={setView} close={() => setOpen(false)} />
            )}
            {view === "register" && <RegisterForm role={role} setView={setView} close={() => setOpen(false)} />}
            {view === "forgot" && <ForgotForm role={role} setView={setView} />}
          </section>
        </div>
      )}
    </AuthModalContext.Provider>
  );
}

function LoginForm({ role, setView, close }: { role: Role; setView: (view: AuthView) => void; close: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const user = await login({ email, password, role });
      close();
      await Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: `Welcome, ${user.name}`,
        showConfirmButton: false,
        timer: 1800,
      });
    } catch (requestError) {
      setError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.message || "Unable to sign in."
          : "Unable to sign in.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-modal-content">
      <span className="role-pill">{role === "admin" ? "Administrator" : "User"} login</span>
      <h2>Welcome back</h2>
      <p>{role === "admin" ? "Use your authorized @ssintern.in account." : "Sign in to explore the complete property portal."}</p>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={submit}>
        <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={role === "admin" ? "name@ssintern.in" : "you@example.com"} required autoFocus /></label>
        <label>Password<span className="password-wrap"><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</button></span></label>
        <button className="primary-button" disabled={busy}><LogIn />{busy ? "Signing in..." : `Sign in as ${role}`}</button>
      </form>
      <div className="auth-modal-links">
        <button onClick={() => setView("forgot")}>Forgot password?</button>
        {role === "user" && <button onClick={() => setView("register")}>Create an account</button>}
      </div>
    </div>
  );
}

function RegisterForm({ role, setView, close }: { role: Role; setView: (view: AuthView) => void; close: () => void }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm_password: "", admin_registration_code: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const update = (key: keyof typeof form, value: string) => setForm({ ...form, [key]: value });
  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const user = await register({ ...form, role });
      close();
      await Swal.fire({ toast: true, position: "top", icon: "success", title: `Account created for ${user.name}`, showConfirmButton: false, timer: 1900 });
    } catch (requestError) {
      const data = axios.isAxiosError(requestError) ? requestError.response?.data : null;
      setError(data ? Object.values(data).flat().join(" ") : "Unable to create account.");
    } finally {
      setBusy(false);
    }
  };
  return <div className="auth-modal-content"><span className="role-pill">New {role}</span><h2>Create {role} account</h2><p>{role === "admin" ? "Use your @ssintern.in email and the private administrator registration code." : "Register once to access properties, projects and enquiries."}</p>{error && <div className="form-error">{error}</div>}<form onSubmit={submit}><label>Full name<input value={form.name} onChange={(event) => update("name", event.target.value)} required autoFocus /></label><label>Email address<input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder={role === "admin" ? "name@ssintern.in" : "you@example.com"} required /></label>{role === "admin" && <label>Admin registration code<input type="password" value={form.admin_registration_code} onChange={(event) => update("admin_registration_code", event.target.value)} required /></label>}<div className="form-two"><label>Password<input type="password" value={form.password} onChange={(event) => update("password", event.target.value)} required /></label><label>Confirm password<input type="password" value={form.confirm_password} onChange={(event) => update("confirm_password", event.target.value)} required /></label></div><button className="primary-button" disabled={busy}><UserPlus />{busy ? "Creating..." : `Create ${role} account`}</button></form><div className="auth-modal-links"><button onClick={() => setView("login")}>Already registered? Sign in</button></div></div>;
}

function ForgotForm({ role, setView }: { role: Role; setView: (view: AuthView) => void }) {
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (step === "email") {
        await forgotRequest({ email, role, step: "verify" });
        setStep("password");
        return;
      }
      await forgotRequest({ email, role, step: "reset", password, confirm_password: confirmPassword });
      await Swal.fire({ icon: "success", title: "Password changed", showConfirmButton: false, timer: 1600 });
      setView("login");
    } catch (requestError) {
      const data = axios.isAxiosError(requestError) ? requestError.response?.data : null;
      setError(data ? Object.values(data).flat().join(" ") : "Unable to reset password.");
    }
    finally { setBusy(false); }
  };
  return <div className="auth-modal-content"><span className="role-pill">{role === "admin" ? "Administrator" : "User"} recovery</span><h2>{step === "email" ? "Forgot password?" : "Create new password"}</h2>{error && <div className="form-error">{error}</div>}<form onSubmit={submit}>{step === "email" ? <><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={role === "admin" ? "name@ssintern.in" : "you@example.com"} required autoFocus /></label><button className="primary-button" disabled={busy}><Mail />{busy ? "Checking..." : "Continue"}</button></> : <><label>New password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoFocus /></label><label>Confirm password<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></label><button className="primary-button" disabled={busy}><KeyRound />{busy ? "Resetting..." : "Reset password"}</button></>}</form><div className="auth-modal-links">{step === "password" && <button onClick={() => { setStep("email"); setPassword(""); setConfirmPassword(""); setError(""); }}>Change email</button>}<button onClick={() => setView("login")}><KeyRound />Back to login</button></div></div>;
}

export function useAuthModal() {
  const value = useContext(AuthModalContext);
  if (!value) throw new Error("useAuthModal must be used inside AuthModalProvider");
  return value;
}
