import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function AuthPage() {
  const { login, signup, error: authError, clearError, loading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const isLogin = useMemo(() => mode === "login", [mode]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("student");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");

  const passwordsMatch = isLogin ? true : password === confirm;

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError("");
    clearError();
  };

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    clearError();

    if (!email.trim()) return setError("Please enter your email.");
    if (!password) return setError("Please enter your password.");

    if (!isLogin) {
      if (!name.trim()) return setError("Please enter your name.");
      if (password.length < 6) return setError("Password must be at least 6 characters.");
      if (!passwordsMatch) return setError("Passwords do not match.");

      const result = await signup({ name, email, password, role });
      if (result.success) {
        navigate(redirectTo, { replace: true });
      } else {
        setError(result.message || "Registration failed");
      }
      return;
    }

    const result = await login({ email, password });
    if (result.success) {
      navigate(redirectTo, { replace: true });
    } else {
      setError(result.message || "Login failed");
    }
  }

  const displayError = error || authError;

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
            onClick={() => handleModeChange("login")}
            aria-selected={isLogin}
          >
            Log In
          </button>
          <button
            type="button"
            className={`auth-tab ${!isLogin ? "auth-tab--active" : ""}`}
            onClick={() => handleModeChange("signup")}
            aria-selected={!isLogin}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {!isLogin && (
            <>
              <label className="auth-field">
                <span>Name</span>
                <input
                  className="auth-input"
                  type="text"
                  autoComplete="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className="auth-field">
                <span>Role</span>
                <select
                  className="auth-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </label>
            </>
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
                placeholder={isLogin ? "••••••••" : "At least 6 characters"}
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
              <small className="hint">Use 6+ characters.</small>
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

          {displayError && <p className="auth-msg auth-msg--bad">{displayError}</p>}

          <button
            className="auth-btn"
            type="submit"
            disabled={loading || (!isLogin && confirm.length > 0 && !passwordsMatch)}
          >
            {loading ? "Please wait..." : isLogin ? "Log In" : "Create Account"}
          </button>
        </form>
      </section>
    </main>
  );
}
