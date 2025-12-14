function StudentSchedule({ enrollments, userRole }) {
    if (userRole !== 'student') {
        return <p>Only students can view schedules</p>
    }
    

    return (
        <div className="page">
            <h1>My Schedule</h1>
            {enrollments.length === 0 ? (
                <p>You are not enrolled in any courses.</p>
            ) : (
                <ul>
                    {enrollments.map(enrollment => (
                        <li key={enrollment._id}>
                            {enrollment.course.courseName} - {enrollment.course.subjectArea} 
                            ({enrollment.course.credits} credits) | Teacher: {enrollment.course.teacher?.name}
                            </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default StudentSchedule