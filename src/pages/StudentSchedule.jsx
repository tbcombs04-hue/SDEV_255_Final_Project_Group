function StudentSchedule({ courses, userRole }) {
    if (userRole !== 'student') {
        return <p>Only students can view schedules</p>
    }
    const enrolledCourses = courses.filter(c => c.enrolled === true)

    return (
        <div className="page">
            <h1>My Schedule</h1>
            {enrolledCourses.length === 0 ? (
                <p>You are not enrolled in any courses.</p>
            ) : (
                <ul>
                    {enrolledCourses.map(course => (
                        <li key={course._id}>
                            {course.name} - {course.subject} ({course.credits} credits)
                            </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default StudentSchedule