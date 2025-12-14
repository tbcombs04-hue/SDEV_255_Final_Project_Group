import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddCourse({ onAdd, userRole}) {
  const [form, setForm] = useState({
    courseName: '',
    courseNumber: '',
    description: '',
    subjectArea: '',
    credits: '',
    semester: ''
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.courseName || !form.courseNumber || !form.description || !form.subjectArea || !form.credits) {
      alert('Please fill in all fields.')
      return
    }
    try {
      const res = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...form, credits: parseInt(form.credits, 10)
        })
        
        
    })
    const data = await res.json()
    if (!data.success) {
    onAdd(data.course)
    setForm({ courseName: '', courseNumber: '', description: '', subjectArea: '', credits: '', semester: '' })
    navigate('/courses')
  }else{
    alert(data.message || 'Failed to add course.')
  }
  } catch (err) {
    console.error('Error adding course:', err)
    alert('Failed to add course. Please try again.')
  }
  }
  if (userRole && userRole !== 'teacher') {
    return <p> You do not have permission to add courses.</p>
  }
  return (
    <div className="page">
      <h1>Add a New Course</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          CourseName="name"
          placeholder="Course Name"
          value={form.courseName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="courseNumber"
          placeholder="Course Number"
          value={form.courseNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="subjectArea"
          placeholder="Subject Area"
          value={form.subjectArea}
          onChange={handleChange}
        />
        <input
          type="number"
          name="credits"
          placeholder="Credits"
          value={form.credits}
          onChange={handleChange}
        />
        <input
          type="text"
          name="semester"
          placeholder="Semester"
          value={form.semester}
          onChange={handleChange}
          />
        <button type="submit">Add Course</button>
      </form>
    </div>
  )
}

export default AddCourse
