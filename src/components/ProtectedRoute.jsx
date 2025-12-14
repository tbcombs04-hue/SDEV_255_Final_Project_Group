import {Navigate} from 'react-router-dom'
function ProtectedRoute({ userRole, allowedRoles, children }) {
    const token = localStorage.getItem('token')
    //if no token, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />
    }
    //if role not allowed, redirect to home
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />
    }
    //Otherwise render the protected component
    return children
}
export default ProtectedRoute