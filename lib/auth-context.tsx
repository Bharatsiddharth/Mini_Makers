"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User, LoginResponse, RegisterPayload } from "./types";
import {
  apiFetch,
  saveTokens,
  clearTokens,
  getTokens,
} from "./api";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // On load, if tokens exist, fetch /auth/me to restore session
    const tokens = getTokens();
    if (!tokens) {
      setLoading(false);
      return;
    }
    apiFetch<User>("/auth/me/")
      .then((me) => setUser(me))
      .catch(() => clearTokens())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiFetch<LoginResponse>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    saveTokens({ access: data.access, refresh: data.refresh });
    setUser(data.user);
    return data.user;
  };

  const register = async (payload: RegisterPayload) => {
    const user = await apiFetch<User>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setUser(user);
    return user;
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}