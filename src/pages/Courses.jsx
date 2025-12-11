
import React, { useState } from 'react'

function Courses({ courses, onDelete, userRole }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filterCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <div className="page">
      <h1>All Courses</h1>
      <input type="text" placeholder="Search courses..." 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="search-input"
      />
      {filteredCourses.length === 0 ? (
        <p>No courses match your search.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Description</th>
              <th>Subject</th>
              <th>Credits</th>
              <th>Teacher</th>
              {userRole === 'teacher' && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map(course => (
              <tr key={course._id}>
                <td>{course.name}</td>
                <td>{course.description}</td>
                <td>{course.subject}</td>
                <td>{course.credits}</td>
                <td>{course.teacher}</td>
                {userRole === 'teacher' && (
                  <td>
                    <button onClick={() => onDelete(course._id)}>Delete</button>
                    {/* Future: <button onClick={() => onEdit(course._id)}>Edit</button> */}
                  </td>
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
