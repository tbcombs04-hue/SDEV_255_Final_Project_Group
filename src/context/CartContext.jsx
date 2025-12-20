/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

/**
 * Cart = courses the student intends to enroll in (pending).
 * Enrolled = courses already enrolled (used to prevent duplicates).
 */
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [enrolled, setEnrolled] = useState([]);

  const addToCart = (course) => {
    setCart((prev) => {
      if (!course?.id) return prev;

      const alreadyInCart = prev.some((c) => c.id === course.id);
      if (alreadyInCart) return prev;

      const alreadyEnrolled = enrolled.some((c) => c.id === course.id);
      if (alreadyEnrolled) return prev;

      return [...prev, course];
    });
  };

  const removeFromCart = (courseId) => {
    setCart((prev) => prev.filter((c) => c.id !== courseId));
  };

  const clearCart = () => setCart([]);

  const markEnrolled = (coursesToEnroll) => {
    // Move from cart -> enrolled, and prevent duplicates.
    setEnrolled((prev) => {
      const next = [...prev];
      for (const c of coursesToEnroll) {
        if (!c?.id) continue;
        if (!next.some((x) => x.id === c.id)) next.push(c);
      }
      return next;
    });

    setCart((prev) => prev.filter((c) => !coursesToEnroll.some((x) => x.id === c.id)));
  };

  const value = {
    cart,
    enrolled,
    addToCart,
    removeFromCart,
    clearCart,
    markEnrolled,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
