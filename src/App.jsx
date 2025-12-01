import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Courses from './pages/Courses.jsx'
import AddCourse from './pages/AddCourse.jsx'
import { useState } from 'react'

function App() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: 'Intro to React',
      description: 'Basics of React library',
      subject: 'Web Development',
      credits: 3,
      teacher: 'Any Teacher'
    }
  ])

  const addCourse = (course) => {
    setCourses([...courses, { ...course, id: Date.now() }])
  }

  const deleteCourse = (id) => {
    setCourses(courses.filter((course) => course.id !== id))
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
