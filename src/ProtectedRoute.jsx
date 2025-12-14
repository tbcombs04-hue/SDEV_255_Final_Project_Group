import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { isAuthed, loading } = useAuth();
  const location = useLocation();

  // Optional loading state
  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading...</div>;
  }

  // If NOT logged in, redirect to /auth
  if (!isAuthed) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // If logged in, show the page
  return children;
}

export default ProtectedRoute;
