import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

function Home() {
  const { user } = useAuth();
  const { cart, enrolled } = useCart();

  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher";

  return (
    <div className="page app-page home-page">
      <h1>Welcome, {user?.name || "User"}!</h1>
      
      <p className="subtitle">
        You are logged in as a <strong>{user?.role}</strong>.
      </p>

      <div className="home-cards">
        {isStudent && (
          <>
            <div className="home-card">
              <h2>📚 Your Cart</h2>
              <p className="card-stat">{cart.length} course(s)</p>
              <p>Ready to enroll in these courses.</p>
              <Link to="/cart" className="btn btnPrimary">
                View Cart
              </Link>
            </div>

            <div className="home-card">
              <h2>✅ Enrolled Courses</h2>
              <p className="card-stat">{enrolled.length} course(s)</p>
              <p>Courses you&apos;re currently taking.</p>
              <Link to="/cart" className="btn">
                View Enrollments
              </Link>
            </div>
          </>
        )}

        <div className="home-card">
          <h2>🎓 Browse Courses</h2>
          <p>Explore all available courses.</p>
          <Link to="/courses" className="btn btnPrimary">
            View Courses
          </Link>
        </div>

        {isTeacher && (
          <div className="home-card">
            <h2>➕ Create Course</h2>
            <p>Add a new course for students.</p>
            <Link to="/add-course" className="btn btnPrimary">
              Add Course
            </Link>
          </div>
        )}
      </div>

      <div className="home-info">
        <h3>Quick Tips</h3>
        {isStudent ? (
          <ul>
            <li>Browse courses and add them to your cart</li>
            <li>Go to your cart to enroll in selected courses</li>
            <li>Check course availability before enrolling</li>
          </ul>
        ) : (
          <ul>
            <li>Create new courses for students to enroll in</li>
            <li>View and manage your existing courses</li>
            <li>Monitor student enrollment numbers</li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home;
