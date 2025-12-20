import { Link } from 'react-router-dom'

function Home({ user }) {
  return (
    <div className="page">
      <div className="home-hero">
        <h1>📚 Course Management System</h1>
        {user ? (
          <p>Welcome back, <strong>{user.name}</strong>! You are logged in as a <strong>{user.role}</strong>.</p>
        ) : (
          <p>Manage and browse courses with ease. Sign in to access all features.</p>
        )}
        <div className="hero-buttons">
          <Link to="/courses" className="hero-btn primary">Browse Courses</Link>
          {!user && (
            <Link to="/login" className="hero-btn secondary">Login</Link>
          )}
          {user?.role === 'teacher' && (
            <Link to="/add-course" className="hero-btn secondary">Add New Course</Link>
          )}
        </div>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">📖</div>
          <h3>Browse Courses</h3>
          <p>View all available courses, including course details, credits, and instructor information.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">👨‍🏫</div>
          <h3>Teacher Features</h3>
          <p>Teachers can create, edit, and delete courses. Manage your curriculum with ease.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">👨‍🎓</div>
          <h3>Student Access</h3>
          <p>Students can browse and view course information in a read-only format.</p>
        </div>
      </div>
    </div>
  )
}

export default Home
