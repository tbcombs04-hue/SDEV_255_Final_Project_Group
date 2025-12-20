import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../AuthContext.jsx";

function Navbar() {
  const { cart } = useCart();
  const { isAuthed, user, logout } = useAuth();

  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher";

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/courses">Courses</Link>
        </li>

        {/* Only teachers can add courses */}
        {isTeacher && (
          <li>
            <Link to="/add-course">Add Course</Link>
          </li>
        )}

        {/* Cart for students */}
        {isStudent && (
          <li>
            <Link to="/cart" className="nav-cart">
              Cart{cart.length > 0 && <span className="badge">{cart.length}</span>}
            </Link>
          </li>
        )}

        {isAuthed ? (
          <li className="nav-right">
            <span className="nav-user">
              {user?.name || user?.email || "User"}
              <span className="nav-role"> ({user?.role})</span>
            </span>
            <button type="button" className="btn btnSmall" onClick={logout}>
              Log Out
            </button>
          </li>
        ) : (
          <li className="nav-right">
            <Link to="/auth" className="btn btnSmall btnPrimary">
              Log In
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
