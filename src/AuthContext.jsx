/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "auth_state_v1";

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getInitialUser() {
  const saved = safeParse(localStorage.getItem(STORAGE_KEY));
  return saved?.user ?? null;
}

export function AuthProvider({ children }) {
  // Initialize from localStorage without setState-in-effect
  const [user, setUser] = useState(getInitialUser);
  const loading = false;

  // Persist to localStorage
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  // UI-only auth actions (backend teammate can replace later)
  const login = async ({ email }) => {
    const nameGuess = email?.split("@")?.[0] || "User";
    setUser({ name: nameGuess, email });
  };

  const signup = async ({ name, email }) => {
    setUser({ name: name?.trim() || "User", email });
  };

  const logout = async () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthed: !!user,
      loading,
      login,
      signup,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
