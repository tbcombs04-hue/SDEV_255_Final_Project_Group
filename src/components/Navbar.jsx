import { Link } from 'react-router-dom'

function Navbar({ userRole }) {
  return (
    <nav className="navbar">
      <ul className = "nav-list">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/courses">Courses</Link></li>
        {userRole === 'teacher' && (
          <li><Link to="/add-course">Add Course</Link></li>
        )}
        {userRole === 'student' && (
          <li><Link to="/schedule">My Schedule</Link></li>
        )}
      </ul>
    </nav>
  )
}
export default Navbar
