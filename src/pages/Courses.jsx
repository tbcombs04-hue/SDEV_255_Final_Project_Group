function Courses({ courses, onDelete }) {
  return (
    <div className="page">
      <h1>All Courses</h1>
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Description</th>
              <th>Subject</th>
              <th>Credits</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.name}</td>
                <td>{course.description}</td>
                <td>{course.subject}</td>
                <td>{course.credits}</td>
                <td>
                  <button onClick={() => onDelete(course.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Courses
