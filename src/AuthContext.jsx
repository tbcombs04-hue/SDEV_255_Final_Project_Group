/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authAPI } from "./api.js";

const AuthContext = createContext(null);
const TOKEN_KEY = "token";
const USER_KEY = "user";

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getInitialUser() {
  return safeParse(localStorage.getItem(USER_KEY));
}

function getInitialToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const [token, setToken] = useState(getInitialToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist to localStorage when user/token changes
  useEffect(() => {
    if (user && token) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [user, token]);

  // Verify token on mount (optional - check if still valid)
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;
      
      try {
        const data = await authAPI.getMe();
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch {
        // Token is invalid, clear auth
        setUser(null);
        setToken(null);
      }
    };

    verifyToken();
  }, []); // Only run on mount

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authAPI.login(email, password);
      
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.message || "Login failed");
        return { success: false, message: data.message };
      }
    } catch (err) {
      const message = err.message || "Login failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ name, email, password, role = "student", studentId }) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authAPI.register({ name, email, password, role, studentId });
      
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.message || "Registration failed");
        return { success: false, message: data.message };
      }
    } catch (err) {
      const message = err.message || "Registration failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setError(null);
  };

  const clearError = () => setError(null);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthed: !!user && !!token,
      loading,
      error,
      login,
      signup,
      logout,
      clearError,
    }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
