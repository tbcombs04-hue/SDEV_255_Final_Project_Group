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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, email } | null
  const [loading, setLoading] = useState(true);

  // Load persisted auth on first mount
  useEffect(() => {
    const saved = safeParse(localStorage.getItem(STORAGE_KEY));
    setUser(saved?.user ?? null);
    setLoading(false);
  }, []);

  // Persist auth whenever user changes
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  // UI-only auth actions (backend teammate can replace later)
  const login = async ({ email, password }) => {
    // TODO: replace with real API call
    const nameGuess = email?.split("@")?.[0] || "User";
    setUser({ name: nameGuess, email });
  };

  const signup = async ({ name, email, password }) => {
    // TODO: replace with real API call
    setUser({ name: name?.trim() || "User", email });
  };

  const logout = async () => {
    // TODO: replace with real API call if needed
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthed: !!user,
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
