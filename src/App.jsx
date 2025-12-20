import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Courses from "./pages/Courses.jsx";
import AddCourse from "./pages/AddCourse.jsx";
import Cart from "./pages/Cart.jsx";
import AuthPage from "./AuthPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { useAuth } from "./AuthContext.jsx";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Courses page - public viewing */}
        <Route path="/courses" element={<Courses />} />

        {/* Add Course - protected, teachers only */}
        <Route
          path="/add-course"
          element={
            <ProtectedRoute requiredRole="teacher">
              <AddCourse />
            </ProtectedRoute>
          }
        />

        {/* Cart - protected, students only */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Redirect old /login route */}
        <Route path="/login" element={<Navigate to="/auth" replace />} />
      </Routes>
    </div>
  );
}

export default App;
