import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../AuthContext.jsx";
import { coursesAPI } from "../api.js";

function Courses() {
  const { cart, enrolled, addToCart } = useCart();
  const { user, isAuthed } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [addingCourseId, setAddingCourseId] = useState(null);

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await coursesAPI.getAll(search);
        if (data.success) {
          setCourses(data.courses || []);
        } else {
          setError(data.message || "Failed to load courses");
        }
      } catch (err) {
        setError(err.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchCourses, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const isInCart = (id) => cart.some((c) => c.id === id);
  const isEnrolled = (id) => enrolled.some((c) => c.id === id);

  const handleAddToCart = async (course) => {
    if (!isAuthed) {
      alert("Please log in to add courses to your cart");
      return;
    }

    setAddingCourseId(course._id);
    try {
      const result = await addToCart(course);
      if (!result.success) {
        alert(result.message || "Failed to add course");
      }
    } catch (err) {
      alert(err.message || "Failed to add course");
    } finally {
      setAddingCourseId(null);
    }
  };

  const handleDelete = async (courseId) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const data = await coursesAPI.delete(courseId);
      if (data.success) {
        setCourses((prev) => prev.filter((c) => c._id !== courseId));
      } else {
        alert(data.message || "Failed to delete course");
      }
    } catch (err) {
      alert(err.message || "Failed to delete course");
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="page app-page">
        <h1>All Courses</h1>
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="page app-page">
      <h1>All Courses</h1>

      {/* Search box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {error && <p className="error-msg">{error}</p>}

      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Description</th>
              <th>Subject</th>
              <th>Credits</th>
              <th>Enrollment</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => {
              const inCart = isInCart(course._id);
              const enrolledAlready = isEnrolled(course._id);
              const isAdding = addingCourseId === course._id;
              const isFull = course.currentEnrollment >= course.maxStudents;
              const isOwnCourse = user?.role === "teacher" && course.teacher?._id === user?.id;

              return (
                <tr key={course._id}>
                  <td>
                    <strong>{course.courseName}</strong>
                    <br />
                    <span className="course-number">{course.courseNumber}</span>
                    {course.teacher && (
                      <span className="teacher-name">
                        <br />
                        Instructor: {course.teacher.name}
                      </span>
                    )}
                  </td>
                  <td>{course.description}</td>
                  <td>{course.subjectArea}</td>
                  <td>{course.credits}</td>
                  <td>
                    {course.currentEnrollment}/{course.maxStudents}
                    {isFull && <span className="badge-full"> (Full)</span>}
                  </td>
                  <td className="actions-cell">
                    {user?.role === "student" && (
                      <button
                        className={`btn ${
                          inCart || enrolledAlready || isFull
                            ? "btnDisabled"
                            : "btnPrimary"
                        }`}
                        onClick={() => handleAddToCart(course)}
                        disabled={inCart || enrolledAlready || isFull || isAdding}
                        title={
                          enrolledAlready
                            ? "Already enrolled"
                            : inCart
                            ? "Already in cart"
                            : isFull
                            ? "Course is full"
                            : "Add to cart"
                        }
                      >
                        {isAdding
                          ? "Adding..."
                          : enrolledAlready
                          ? "Enrolled"
                          : inCart
                          ? "In Cart"
                          : isFull
                          ? "Full"
                          : "Add to Cart"}
                      </button>
                    )}

                    {/* Only teachers can delete their own courses */}
                    {user?.role === "teacher" && isOwnCourse && (
                      <button
                        className="btn btnDanger"
                        onClick={() => handleDelete(course._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Courses;
