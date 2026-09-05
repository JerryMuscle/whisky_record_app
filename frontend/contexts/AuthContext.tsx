"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { User } from "@/types";
import { authMe, getMe } from "@/lib/api";
import * as cognito from "@/lib/cognito";

type AuthContextType = {
  user: User | null;
  token: string;
  loading: boolean;
  login: (email: string, password: string, username?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: "",
  loading: true,
  login: async () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const tokens = await cognito.getCurrentSession();
      if (tokens) {
        try {
          const me = await authMe(tokens.idToken);
          setToken(tokens.idToken);
          setUser(me);
        } catch {
          cognito.signOut();
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string, username?: string) => {
    const tokens = await cognito.signIn(email, password);
    const me = await authMe(tokens.idToken, username);
    setToken(tokens.idToken);
    setUser(me);
  }, []);

  const logout = useCallback(() => {
    cognito.signOut();
    setToken("");
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    const me = await getMe(token);
    setUser(me);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
