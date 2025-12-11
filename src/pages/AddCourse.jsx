import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddCourse({ onAdd, userRole}) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    subject: '',
    credits: '',
    teacher: ''
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name || !form.description || !form.subject || !form.credits) {
      alert('Please fill in all fields.')
      return
    }
    try {
      const res = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ...form, credits: parseInt(form.credits, 10)
        })
        
        
    })
      const newCourse = await res.json()

    onAdd({ ...form, credits: parseInt(form.credits) })
    setForm({ name: '', description: '', subject: '', credits: '', teacher: '' })
    navigate('/courses')
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
          name="name"
          placeholder="Course Name"
          value={form.name}
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
          name="subject"
          placeholder="Subject Area"
          value={form.subject}
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
          name="teacher"
          placeholder="Teacher"
          value={form.teacher}
          onChange={handleChange}
          />
        <button type="submit">Add Course</button>
      </form>
    </div>
  )
}

export default AddCourse
