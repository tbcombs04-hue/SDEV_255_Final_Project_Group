import React from "react";
import { useCart } from "../context/CartContext.jsx";

function Courses({ courses, onDelete }) {
  const { cart, enrolled, addToCart } = useCart();

  const isInCart = (id) => cart.some((c) => c.id === id);
  const isEnrolled = (id) => enrolled.some((c) => c.id === id);

  return (
    <div className="page app-page">
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
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => {
              const inCart = isInCart(course.id);
              const enrolledAlready = isEnrolled(course.id);

              return (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td>{course.description}</td>
                  <td>{course.subject}</td>
                  <td>{course.credits}</td>
                  <td className="actions-cell">
                    <button
                      className={`btn ${inCart || enrolledAlready ? "btnDisabled" : "btnPrimary"}`}
                      onClick={() => addToCart(course)}
                      disabled={inCart || enrolledAlready}
                      title={enrolledAlready ? "Already enrolled" : inCart ? "Already in cart" : "Add to cart"}
                    >
                      {enrolledAlready ? "Enrolled" : inCart ? "Added" : "Add Course"}
                    </button>

                    <button className="btn btnDanger" onClick={() => onDelete(course.id)}>
                      Delete
                    </button>
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
