import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function AuthPage() {
  const { login, signup } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const isLogin = useMemo(() => mode === "login", [mode]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");

  const passwordsMatch = isLogin ? true : password === confirm;

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim()) return setError("Please enter your email.");
    if (!password) return setError("Please enter your password.");

    if (!isLogin) {
      if (!name.trim()) return setError("Please enter your name.");
      if (password.length < 8) return setError("Password must be at least 8 characters.");
      if (!passwordsMatch) return setError("Passwords do not match.");

      await signup({ name, email, password });
      navigate(redirectTo, { replace: true });
      return;
    }

    await login({ email, password });
    navigate(redirectTo, { replace: true });
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="authTitle">
        <header className="auth-card__header">
          <h1 id="authTitle">Welcome</h1>
          <p>{isLogin ? "Log in to continue" : "Create an account to get started"}</p>
        </header>

        <div className="auth-tabs" role="tablist" aria-label="Authentication tabs">
          <button
            type="button"
            className={`auth-tab ${isLogin ? "auth-tab--active" : ""}`}
            onClick={() => setMode("login")}
            aria-selected={isLogin}
          >
            Log In
          </button>
          <button
            type="button"
            className={`auth-tab ${!isLogin ? "auth-tab--active" : ""}`}
            onClick={() => setMode("signup")}
            aria-selected={!isLogin}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {!isLogin && (
            <label className="auth-field">
              <span>Name</span>
              <input
                className="auth-input"
                type="text"
                autoComplete="name"
                placeholder="Isaiah Snelling"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}

          <label className="auth-field">
            <span>Email</span>
            <input
              className="auth-input"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="auth-field">
            <span>{isLogin ? "Password" : "Create password"}</span>

            <div className="auth-password">
              <input
                className="auth-input"
                type={showPass ? "text" : "password"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder={isLogin ? "••••••••" : "At least 8 characters"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                className="auth-ghost"
                type="button"
                onClick={() => setShowPass((s) => !s)}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            {!isLogin && (
              <small className="hint">Use 8+ characters. Numbers/symbols help.</small>
            )}
          </label>

          {!isLogin && (
            <label className="auth-field">
              <span>Confirm password</span>

              <div className="auth-password">
                <input
                  className="auth-input"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />

                <button
                  className="auth-ghost"
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>

              {confirm.length > 0 && (
                <p className={`auth-msg ${passwordsMatch ? "auth-msg--ok" : "auth-msg--bad"}`}>
                  {passwordsMatch ? "Passwords match ✅" : "Passwords do not match ❌"}
                </p>
              )}
            </label>
          )}

          {error && <p className="auth-msg auth-msg--bad">{error}</p>}

          <button
            className="auth-btn"
            type="submit"
            disabled={!isLogin && confirm.length > 0 && !passwordsMatch}
          >
            {isLogin ? "Log In" : "Create Account"}
          </button>
        </form>
      </section>
    </main>
  );
}
