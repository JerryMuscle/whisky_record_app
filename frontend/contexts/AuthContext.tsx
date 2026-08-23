"use client";

import { createContext, useContext } from "react";

type AuthContextType = {
  token: string;
};

const AuthContext = createContext<AuthContextType>({ token: "" });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // DEV_MODE: トークンは空文字（バックエンドが検証をスキップ）
  // Cognito導入後はここでトークンを取得・管理する
  return (
    <AuthContext.Provider value={{ token: "" }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
