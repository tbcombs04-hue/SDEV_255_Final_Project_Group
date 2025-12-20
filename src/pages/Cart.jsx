import React, { useMemo, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../AuthContext.jsx";

function Cart() {
  const { cart, removeFromCart, clearCart, markEnrolled, enrolled } = useCart();
  const { user } = useAuth();
  const [msg, setMsg] = useState("");

  const canEnroll = cart.length > 0;

  const alreadyEnrolledIds = useMemo(() => new Set(enrolled.map((c) => c.id)), [enrolled]);

  const enroll = async () => {
    setMsg("");

    // UI-level duplicate protection (should already be prevented, but safe)
    const toEnroll = cart.filter((c) => !alreadyEnrolledIds.has(c.id));
    if (toEnroll.length === 0) {
      setMsg("You're already enrolled in all courses currently in your cart.");
      return;
    }

    try {
      // Optional backend (in-memory) — won’t break if server isn’t running.
      const res = await fetch("http://localhost:3000/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user?.email || "guest@example.com",
          courseIds: toEnroll.map((c) => c.id),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const duplicates = data?.duplicates?.length || 0;
        markEnrolled(toEnroll);
        setMsg(
          duplicates > 0
            ? `Enrolled! (${duplicates} duplicate request(s) were ignored.)`
            : "Enrolled!"
        );
        return;
      }

      // If server responded but not ok
      markEnrolled(toEnroll);
      setMsg("Enrolled! (Server validation failed, but UI updated.)");
    } catch {
      // If backend not running, still allow UI to progress.
      markEnrolled(toEnroll);
      setMsg("Enrolled! (Backend not running — UI updated.)");
    }
  };

  return (
    <div className="page app-page">
      <h1>Cart</h1>

      {msg && <p className="notice">{msg}</p>}

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
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
              {cart.map((course) => (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td>{course.description}</td>
                  <td>{course.subject}</td>
                  <td>{course.credits}</td>
                  <td>
                    <button className="btn btnDanger" onClick={() => removeFromCart(course.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-actions">
            <button className="btn btnPrimary" onClick={enroll} disabled={!canEnroll}>
              Enroll Now
            </button>
            <button className="btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
