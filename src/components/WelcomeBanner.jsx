import {useContext} from 'react'
import { AuthContext } from '../context/AuthContext.js'

function WelcomeBanner() {
  const { token, userRole, logout } = useContext(AuthContext)

  return (
    <div className="welcome-banner">
    <h2>
    Welcome {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'Guest'}!
    </h2>
    {token && (
      <button onClick={logout} className="logout-button">
        Logout
        </button>
    )}
    </div>
)
  }
export default WelcomeBanner
