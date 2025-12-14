import { useState } from 'react'

function Courses({ courses, onDelete, onUpdate, isTeacher, user }) {
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({
    courseName: '',
    description: '',
    subjectArea: '',
    credits: ''
  })

  const handleEditClick = (course) => {
    setEditingId(course._id)
    setEditForm({
      courseName: course.courseName,
      description: course.description,
      subjectArea: course.subjectArea,
      credits: course.credits
    })
  }

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleEditSubmit = async (id) => {
    const result = await onUpdate(id, {
      ...editForm,
      credits: parseInt(editForm.credits)
    })
    
    if (result.success) {
      setEditingId(null)
    } else {
      alert(result.message || 'Failed to update course')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({
      courseName: '',
      description: '',
      subjectArea: '',
      credits: ''
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await onDelete(id)
    }
  }

  return (
    <div className="page app-page">
      <h1>All Courses</h1>
      
      {!user && (
        <p className="info-message">
          <em>Please <a href="/login">login</a> to access all features.</em>
        </p>
      )}
      
      {user && !isTeacher && (
        <p className="info-message">
          <em>You are logged in as a Student. You can view courses but cannot add, edit, or delete them.</em>
        </p>
      )}
      
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Course Number</th>
              <th>Course Name</th>
              <th>Description</th>
              <th>Subject Area</th>
              <th>Credits</th>
              <th>Teacher</th>
              {/* Only show Actions column for teachers */}
              {isTeacher && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                {editingId === course._id ? (
                  // Edit mode
                  <>
                    <td>{course.courseNumber}</td>
                    <td>
                      <input
                        type="text"
                        name="courseName"
                        value={editForm.courseName}
                        onChange={handleEditChange}
                        className="edit-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        className="edit-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="subjectArea"
                        value={editForm.subjectArea}
                        onChange={handleEditChange}
                        className="edit-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="credits"
                        value={editForm.credits}
                        onChange={handleEditChange}
                        className="edit-input"
                        min="1"
                        max="6"
                      />
                    </td>
                    <td>{course.teacher?.name || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEditSubmit(course._id)}
                          className="save-btn"
                        >
                          Save
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  // View mode
                  <>
                    <td>{course.courseNumber}</td>
                    <td>{course.courseName}</td>
                    <td>{course.description}</td>
                    <td>{course.subjectArea}</td>
                    <td>{course.credits}</td>
                    <td>{course.teacher?.name || 'N/A'}</td>
                    {/* Only show action buttons for teachers */}
                    {isTeacher && (
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleEditClick(course)}
                            className="edit-btn"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(course._id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Courses