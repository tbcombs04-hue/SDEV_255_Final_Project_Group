import {useContext} from 'react'
import { AuthContext } from '../context/AuthContext.js'
import { Link } from 'react-router-dom'

function Navbar() {
  const { token, userRole, logout } = useContext(AuthContext)
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
        {!token && (
          <li><Link to="/login">Login</Link></li>
        )}
        {token && (
          <li><button onClick={logout} className="logout-button">Logout</button></li>
        )}
      </ul>
    </nav>
  )
}
export default Navbar
