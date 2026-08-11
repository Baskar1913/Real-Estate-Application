import { BadgeCheck, Building2, KeyRound } from "lucide-react";
import type { ReactNode } from "react";
import Brand from "../../components/Brand";

export default function AuthShell({ children }: { children: ReactNode }) {
  return <div className="auth-page">
    <section className="auth-visual">
      <Brand />
      <div className="auth-pitch"><span className="eyebrow">Trusted real estate platform</span><h1>Find a place that feels like yours.</h1><p>Verified homes, premium projects and transparent property guidance—all in one place.</p><div className="auth-points"><span><BadgeCheck/>Verified properties</span><span><Building2/>Premium projects</span><span><KeyRound/>Secure access</span></div></div>
      <small>© 2026 Real Estate Properties</small>
    </section>
    <section className="auth-form-side"><div className="mobile-auth-brand"><Brand/></div>{children}</section>
  </div>;
}

