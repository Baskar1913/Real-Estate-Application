import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { currentUserRequest, loginRequest, logoutRequest, registerRequest } from "../services/auth";
import type { AuthUser, LoginData, RegisterData } from "../types";

interface AuthValue {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  login(data: LoginData): Promise<AuthUser>;
  register(data: RegisterData): Promise<AuthUser>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      if (!localStorage.getItem("auth_token")) return setLoading(false);
      try { setUser(await currentUserRequest()); }
      catch { localStorage.removeItem("auth_token"); }
      finally { setLoading(false); }
    };
    void restore();
  }, []);

  useEffect(() => {
    const expire = () => setUser(null);
    window.addEventListener("auth-session-expired", expire);
    return () => window.removeEventListener("auth-session-expired", expire);
  }, []);

  const value = useMemo<AuthValue>(() => ({
    user,
    loading,
    isAdmin: user?.role === "admin",
    login: async (data) => {
      const response = await loginRequest(data);
      localStorage.setItem("auth_token", response.token);
      setUser(response.user);
      return response.user;
    },
    register: async (data) => {
      const response = await registerRequest(data);
      localStorage.setItem("auth_token", response.token);
      setUser(response.user);
      return response.user;
    },
    logout: async () => {
      try { await logoutRequest(); } catch { /* clear local session regardless */ }
      localStorage.removeItem("auth_token");
      setUser(null);
    },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
