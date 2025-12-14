import React from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export default function WelcomeBar() {
  const { isAuthed, user, logout } = useAuth();

  if (!isAuthed) return null;

  return (
    <header className="welcome-bar">
      <span className="welcome-text">
        Welcome, <strong>{user?.name || "User"}</strong> 👋
      </span>
      <button className="logout-btn" type="button" onClick={logout}>
        Log Out
      </button>
    </header>
  );
}
