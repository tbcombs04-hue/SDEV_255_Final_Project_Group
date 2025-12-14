
import React, { useState } from 'react'

function Courses({ courses, onDelete, userRole }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.subjectArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              <th>Subject Area</th>
              <th>Credits</th>
              <th>Teacher</th>
              {userRole === 'teacher' && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map(course => (
              <tr key={course._id}>
                <td>{course.courseName}</td>
                <td>{course.description}</td>
                <td>{course.subjectArea}</td>
                <td>{course.credits}</td>
                <td>{course.teacher?.name}</td>
                {userRole === 'teacher' && (
                  <td>
                    <button onClick={() => onDelete(course._id)}>Delete</button>
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
