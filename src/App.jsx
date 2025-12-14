import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Courses from './pages/Courses.jsx'
import AddCourse from './pages/AddCourse.jsx'
import StudentSchedule from './pages/StudentSchedule.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import WelcomeBanner from './components/WelcomeBanner.jsx'

function App() {
  const [courses, setCourses] = useState([])
const [enrollments, setEnrollments] = useState([])
const [userRole, setUserRole] = useState(null) // null until loging
const navigate = useNavigate()
//Load courses
 useEffect(() => {
    fetch('http://localhost:5000/api/courses')
    .then(res => res.json())
    .then(data => setCourses(data.courses))
    .catch(err => console.error('Error fetching courses:', err));
  }, [])

  //on app load, ceck for token and set role
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try{
      const decoded = jwtDecode(token)
      setUserRole(decoded.role)
      //f student, fetch enrollments
      if (decoded.role === 'student') {
        fetch(`http://localhost:5000/api/enrollments/user/${decoded.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then(data => { if (data.success) {
          setEnrollments(data.enrollments)
      }
      })
        .catch(err => console.error('Error fetching enrollments:', err));
      }
    } catch (err) {
      console.error('Invalid token:', err)
      localStorage.removeItem('token')
    }
  }
}, [])
// Add course
  const addCourse = async (course) => {
    try {
      const res = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(course)
      })
      const data = await res.json()
      if(data.success){
      setCourses([...courses, data.course])
      }
    } catch (err) {
      console.error('Error adding course:', err)
    }
    
  }
// Delete course
  const deleteCourse = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    
    setCourses(courses.filter((course) => course._id !== id))
  } catch (err) {
    console.error('Error deleting course:', err)
  }
  }
  //Logout flow
  const logout = () => {
    localStorage.removeItem('token')
    setUserRole(null)
    setEnrollments([])
    navigate('/login')
  }
  return (
    <div>
      <Navbar userRole={userRole} logout={logout}/>
      <WelcomeBanner userRole={userRole} logout={logout}/>
      <Routes>
        {/* Public auth page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected pages */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={<Courses courses={courses} onDelete={deleteCourse} userRole={userRole} />}
        />
        //teacher-only route
        <Route
          path="/add-course"
          element={<ProtectedRoute userRole={userRole} allowedRoles={['teacher']}>
          <AddCourse onAdd={addCourse} userRole={userRole} />
          </ProtectedRoute>
          }
        />
        //student-only route
        <Route path="/schedule" 
        element={<ProtectedRoute userRole={userRole} allowedRoles={['student']}>
        <StudentSchedule enrollments={enrollments} userRole = {userRole}/>
        </ProtectedRoute>
        }
        />
        <Route
          path="/login"
          element={<LoginPage setUserRole={setUserRole} />}
        />
      </Routes>
    </div>
  );
}

export default App;
