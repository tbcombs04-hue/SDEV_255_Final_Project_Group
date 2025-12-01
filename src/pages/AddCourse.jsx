import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddCourse({ onAdd }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    subject: '',
    credits: ''
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name || !form.description || !form.subject || !form.credits) {
      alert('Please fill in all fields.')
      return
    }

    onAdd({ ...form, credits: parseInt(form.credits) })
    setForm({ name: '', description: '', subject: '', credits: '' })
    navigate('/courses')
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
        <button type="submit">Add Course</button>
      </form>
    </div>
  )
}

export default AddCourse
