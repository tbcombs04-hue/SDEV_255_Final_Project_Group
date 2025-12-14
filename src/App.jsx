import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Courses from './pages/Courses.jsx'
import AddCourse from './pages/AddCourse.jsx'
import Login from './pages/Login.jsx'
import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000/api'

function App() {
  const [courses, setCourses] = useState([])
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing login on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Fetch courses from backend
  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/courses`)
      const data = await response.json()
      
      if (data.success) {
        setCourses(data.courses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const handleLogin = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
  }

  const addCourse = async (courseData) => {
    try {
      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add course')
      }

      // Refresh courses list
      fetchCourses()
      return { success: true }
    } catch (error) {
      console.error('Error adding course:', error)
      return { success: false, message: error.message }
    }
  }

  const deleteCourse = async (id) => {
    try {
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete course')
      }

      // Refresh courses list
      fetchCourses()
      return { success: true }
    } catch (error) {
      console.error('Error deleting course:', error)
      alert(error.message)
      return { success: false, message: error.message }
    }
  }

  const updateCourse = async (id, courseData) => {
    try {
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update course')
      }

      // Refresh courses list
      fetchCourses()
      return { success: true }
    } catch (error) {
      console.error('Error updating course:', error)
      return { success: false, message: error.message }
    }
  }

  // Check if user is a teacher
  const isTeacher = user?.role === 'teacher'

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} isTeacher={isTeacher} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route
          path="/courses"
          element={
            <Courses 
              courses={courses} 
              onDelete={deleteCourse}
              onUpdate={updateCourse}
              isTeacher={isTeacher}
              user={user}
            />
          }
        />
        <Route
          path="/add-course"
          element={
            isTeacher ? (
              <AddCourse onAdd={addCourse} />
            ) : (
              <Navigate to="/courses" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/courses" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
      </Routes>
    </div>
  )
}

export default App
