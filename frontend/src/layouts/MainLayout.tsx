import { LogIn, Mail, MapPin, Menu, Phone, Shield, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Brand from "../components/Brand";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";
import api from "../services/api";
import type { ContactInfoRecord } from "../types";

export default function MainLayout() {
  const { user, isAdmin, logout } = useAuth();
  const { openLogin } = useAuthModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [contact, setContact] = useState<ContactInfoRecord | null>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const nav = [
    ["/", "Home"],
    ["/about", "About"],
    ["/properties", "Properties"],
    ["/projects", "Projects"],
    ["/contact", "Contact"],
  ];

  useEffect(() => {
    const loadContact = () => {
      void api.get<ContactInfoRecord[]>("/contact-info/").then((response) => setContact(response.data[0] || null));
    };
    loadContact();
    window.addEventListener("contact-info-updated", loadContact);
    return () => window.removeEventListener("contact-info-updated", loadContact);
  }, []);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const signOut = async () => {
    await logout();
    setAccountOpen(false);
    navigate("/", { replace: true });
  };

  const chooseLogin = (role: "user" | "admin") => {
    setAccountOpen(false);
    openLogin(role);
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Brand />

          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X /> : <Menu />}
          </button>

          <nav className={menuOpen ? "main-nav open" : "main-nav"}>
            {nav.map(([to, text]) => <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}>{text}</NavLink>)}
            {isAdmin && <NavLink className="admin-link" to="/manage" onClick={() => setMenuOpen(false)}><Shield size={15} />Manage</NavLink>}
          </nav>

          <div className="header-account" ref={accountRef}>
            <button className="account-trigger icon-only" onClick={() => setAccountOpen(!accountOpen)} aria-label="Open account menu" title="Account">
              <UserRound size={20} />
            </button>

            {accountOpen && (
              <div className="account-dropdown right-aligned">
                {user ? (
                  <>
                    <div className="signed-user"><strong>{user.name}</strong><span>{user.email}</span><em>{user.role}</em></div>
                    {isAdmin && <button onClick={() => { setAccountOpen(false); navigate("/manage"); }}><Shield />Open management</button>}
                    <button onClick={() => void signOut()}><LogIn />Logout</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => chooseLogin("user")}><UserRound />User</button>
                    <button onClick={() => chooseLogin("admin")}><Shield />Admin</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main><Outlet /></main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div><Brand /><p>Premium residential and commercial properties with complete transparency and trusted consultation.</p></div>
          <div><h4>Quick links</h4><NavLink to="/about">About</NavLink><NavLink to="/properties">Properties</NavLink><NavLink to="/projects">Projects</NavLink></div>
          <div><h4>Services</h4><span>Buy Property</span><span>Sell Property</span><span>Property Investment</span></div>
          <div className="footer-contact"><h4>Contact</h4><span><Phone />{contact?.phone || "Contact number coming soon"}</span><span><Mail />{contact?.email || "Email coming soon"}</span><span><MapPin />{contact?.address || "Office address coming soon"}</span></div>
        </div>
        <div className="copyright">© 2026 Real Estate Properties. All rights reserved.</div>
      </footer>
    </div>
  );
}
