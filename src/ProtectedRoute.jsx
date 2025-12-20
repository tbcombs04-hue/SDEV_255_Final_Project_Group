import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthed, loading, user } = useAuth();
  const location = useLocation();

  // Show loading state
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

  // If a specific role is required, check it
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Access Denied</h2>
        <p>You need to be a {requiredRole} to access this page.</p>
      </div>
    );
  }

  // If logged in (and role matches if required), show the page
  return children;
}

export default ProtectedRoute;
