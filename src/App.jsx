import React, { useState } from "react";
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
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Intro to React",
      description: "Basics of the React library",
      subject: "Web Development",
      credits: 3,
    },
    {
      id: 2,
      name: "Node & Express",
      description: "Build APIs using Express",
      subject: "Web Development",
      credits: 3,
    },
    {
      id: 3,
      name: "Database Fundamentals",
      description: "Intro to relational databases",
      subject: "Databases",
      credits: 3,
    },
  ]);

  const addCourse = (course) => {
    const credits = Number.isFinite(course.credits)
      ? course.credits
      : parseInt(course.credits, 10);

    setCourses((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: course.name?.trim() || "Untitled Course",
        description: course.description?.trim() || "",
        subject: course.subject?.trim() || "",
        credits: Number.isFinite(credits) ? credits : 0,
      },
    ]);
  };

  const deleteCourse = (id) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  const { isAuthed, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
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

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses courses={courses} onDelete={deleteCourse} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-course"
          element={
            <ProtectedRoute>
              <AddCourse onAdd={addCourse} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to={isAuthed ? "/" : "/auth"} replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
