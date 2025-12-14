import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import {AuthContext} from '../context/AuthContext.js'

function LoginPage({ setUserRole}) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed')
        return
      }

      //Save token to LocalStorage
      localStorage.setItem('token', data.token)

      //Decode role from JWT
      try {
        const decoded = jwtDecode(data.token)
        setUserRole(decoded.role)
      } catch (err) {
        console.error('Error decoding token:', err)
        
      
    }

      //Navigate to courses
      navigate('/courses')
    } catch (err) {
      console.error('Login error:', err)
      setError('Server error. Please try again later.')
    }
  }
  return (
    <div className="login-container">
      <h1 className="login-name">Login</h1>
      <form className= "login-form" onSubmit={handleSubmit} >
        <div className ="form-group">
          <label>Email</label>
        
        <input
        type="text"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        />
        </div>
        <div className ="form-group">
          <label>Password</label>
        <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        />
        </div>
        {error && <p className="error">{error}</p>}
        <button type = "submit">Login</button>
        </form>
        
        </div>
  )
}

export default LoginPage
