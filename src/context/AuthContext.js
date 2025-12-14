import {createContext, useState, useEffect} from 'react'
import jwtDecode from 'jwt-decode'

export const AuthContext = createContext()

export function AuthProvider  ({children}) {

    const [userRole, setUserRole] = useState(null)
    const [token, setToken] = useState(null)

    //on app load, check for toekn
    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
            setToken(storedToken)
            try {
                const decoded = jwtDecode(storedToken)
                setUserRole(decoded.role)
            } catch (err) {
                console.error('Invalid token:', err)
                localStorage.removeItem('token')
            }
        }
    }, [])

    const login = (newToken) => {
        localStorage.setItem('token', newToken)
        setToken(newToken)
        try {
            const decoded = jwtDecode(newToken)
            setUserRole(decoded.role)
        } catch (err) {
            console.error('Error decoding token:', err)
        }
    }
    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUserRole(null)
    }
    return (
        <AuthContext.Provider value={{userRole, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}