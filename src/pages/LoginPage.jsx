import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

      //Decode role from response
      if (data.user && data.user.role) {
        setUserRole(data.user.role)
      }

      //Navigate to courses
      navigate('/courses')
    } catch (err) {
      console.error('Login error:', err)
      setError('Server error. Please try again later.')
    }
  }
  return (
    <div className="page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} >
        <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        />
        <button type = "submit">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
        </div>
  )
}

export default LoginPage
