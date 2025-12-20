import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../AuthContext.jsx";

function Cart() {
  const { cart, removeFromCart, clearCart, enrollAll, enrolled, loading, dropCourse } = useCart();
  const { user } = useAuth();
  const [msg, setMsg] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [droppingId, setDroppingId] = useState(null);

  const canEnroll = cart.length > 0 && !enrolling;

  const handleEnroll = async () => {
    setMsg("");
    setEnrolling(true);

    try {
      const result = await enrollAll();

      if (result.success) {
        setMsg(`Successfully enrolled in ${result.enrolled.length} course(s)!`);
      } else if (result.enrolled.length > 0) {
        setMsg(
          `Enrolled in ${result.enrolled.length} course(s). ` +
          `${result.failed.length} failed: ${result.failed.map((f) => f.reason).join(", ")}`
        );
      } else {
        setMsg(`Enrollment failed: ${result.failed.map((f) => f.reason).join(", ")}`);
      }
    } catch (err) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setEnrolling(false);
    }
  };

  const handleRemove = async (courseId) => {
    const result = await removeFromCart(courseId);
    if (!result.success) {
      setMsg(`Failed to remove: ${result.message}`);
    }
  };

  const handleClear = async () => {
    await clearCart();
    setMsg("");
  };

  const handleDrop = async (courseId, courseName) => {
    if (!confirm(`Are you sure you want to drop "${courseName}"?`)) return;
    
    setDroppingId(courseId);
    setMsg("");
    
    try {
      const result = await dropCourse(courseId);
      if (result.success) {
        setMsg(`Successfully dropped "${courseName}"`);
      } else {
        setMsg(`Failed to drop course: ${result.message}`);
      }
    } catch (err) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setDroppingId(null);
    }
  };

  if (loading) {
    return (
      <div className="page app-page">
        <h1>Cart</h1>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="page app-page">
      <h1>Cart</h1>
      
      {user?.role === "teacher" && (
        <p className="notice">Note: Teachers cannot enroll in courses. Cart is view-only.</p>
      )}

      {msg && <p className="notice">{msg}</p>}

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Description</th>
                <th>Subject</th>
                <th>Credits</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((course) => (
                <tr key={course.id}>
                  <td>
                    <strong>{course.name}</strong>
                    {course.courseNumber && (
                      <span className="course-number"> ({course.courseNumber})</span>
                    )}
                  </td>
                  <td>{course.description}</td>
                  <td>{course.subject}</td>
                  <td>{course.credits}</td>
                  <td>
                    <button
                      className="btn btnDanger"
                      onClick={() => handleRemove(course.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-actions">
            {user?.role === "student" && (
              <button
                className="btn btnPrimary"
                onClick={handleEnroll}
                disabled={!canEnroll}
              >
                {enrolling ? "Enrolling..." : "Enroll Now"}
              </button>
            )}
            <button className="btn" onClick={handleClear} disabled={enrolling}>
              Clear Cart
            </button>
          </div>
        </>
      )}

      {/* Show enrolled courses */}
      {enrolled.length > 0 && (
        <div className="enrolled-section">
          <h2>Enrolled Courses</h2>
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Description</th>
                <th>Subject</th>
                <th>Credits</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {enrolled.map((course) => (
                <tr key={course.id}>
                  <td>
                    <strong>{course.name}</strong>
                    {course.courseNumber && (
                      <span className="course-number"> ({course.courseNumber})</span>
                    )}
                  </td>
                  <td>{course.description}</td>
                  <td>{course.subject}</td>
                  <td>{course.credits}</td>
                  <td>
                    <button
                      className="btn btnDanger"
                      onClick={() => handleDrop(course.id, course.name)}
                      disabled={droppingId === course.id}
                    >
                      {droppingId === course.id ? "Dropping..." : "Drop Course"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Cart;
