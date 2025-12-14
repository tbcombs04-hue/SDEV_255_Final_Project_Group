import { Link } from 'react-router-dom'

function Navbar({ user, onLogout, isTeacher }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          {/* Only show Add Course link for teachers */}
          {isTeacher && (
            <li><Link to="/add-course">Add Course</Link></li>
          )}
        </ul>
        
        <div className="nav-auth">
          {user ? (
            <>
              <span className="welcome-message">
                Welcome, <strong>{user.name}</strong>
                <span className="user-role">({user.role})</span>
              </span>
              <button onClick={onLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="login-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
