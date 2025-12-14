import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddCourse({ onAdd }) {
  const [form, setForm] = useState({
    courseName: '',
    courseNumber: '',
    description: '',
    subjectArea: '',
    credits: '',
    maxStudents: '30',
    semester: 'Fall',
    year: new Date().getFullYear().toString()
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!form.courseName || !form.courseNumber || !form.description || !form.subjectArea || !form.credits) {
      setError('Please fill in all required fields.')
      setLoading(false)
      return
    }

    const courseData = {
      courseName: form.courseName,
      courseNumber: form.courseNumber,
      description: form.description,
      subjectArea: form.subjectArea,
      credits: parseInt(form.credits),
      maxStudents: parseInt(form.maxStudents),
      semester: form.semester,
      year: parseInt(form.year)
    }

    const result = await onAdd(courseData)

    if (result.success) {
      setForm({
        courseName: '',
        courseNumber: '',
        description: '',
        subjectArea: '',
        credits: '',
        maxStudents: '30',
        semester: 'Fall',
        year: new Date().getFullYear().toString()
      })
      navigate('/courses')
    } else {
      setError(result.message || 'Failed to add course')
    }
    
    setLoading(false)
  }

  return (
    <div className="page">
      <h1>Add a New Course</h1>
      <p className="subtitle">Only teachers can add new courses to the system.</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-group">
          <label htmlFor="courseNumber">Course Number *</label>
          <input
            type="text"
            id="courseNumber"
            name="courseNumber"
            placeholder="e.g., SDEV-255"
            value={form.courseNumber}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="courseName">Course Name *</label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            placeholder="e.g., Web Development"
            value={form.courseName}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="Course description"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="subjectArea">Subject Area *</label>
          <input
            type="text"
            id="subjectArea"
            name="subjectArea"
            placeholder="e.g., Computer Science"
            value={form.subjectArea}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="credits">Credits *</label>
            <input
              type="number"
              id="credits"
              name="credits"
              placeholder="1-6"
              min="1"
              max="6"
              value={form.credits}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="maxStudents">Max Students</label>
            <input
              type="number"
              id="maxStudents"
              name="maxStudents"
              placeholder="30"
              min="1"
              value={form.maxStudents}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="semester">Semester</label>
            <select
              id="semester"
              name="semester"
              value={form.semester}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Fall">Fall</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input
              type="number"
              id="year"
              name="year"
              min="2024"
              max="2030"
              value={form.year}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding Course...' : 'Add Course'}
        </button>
      </form>
    </div>
  )
}

export default AddCourse
