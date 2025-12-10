import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Courses from './pages/Courses.jsx'
import AddCourse from './pages/AddCourse.jsx'
import { useState, useEffect } from 'react'

function App() {
  const [courses, setCourses] = useState([]
)
  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
    .then(res => res.json())
    .then(data => setCourses(data))
    .catch(err => console.error('Error fetching courses:', err));
  }, [])

  const addCourse = async (course) => {
    try {
      const res = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(course)
      })
      const newCourse = await res.json()
      setCourses([...courses, newCourse])
    } catch (err) {
      console.error('Error adding course:', err)
    }
    
  }

  const deleteCourse = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'DELETE'
    })
    
    setCourses(courses.filter((course) => course._id !== id))
  } catch (err) {
    console.error('Error deleting course:', err)
  }
  }
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/courses"
          element={<Courses courses={courses} onDelete={deleteCourse} />}
        />
        <Route
          path="/add-course"
          element={<AddCourse onAdd={addCourse} />}
        />
      </Routes>
    </div>
  )
}

export default App
