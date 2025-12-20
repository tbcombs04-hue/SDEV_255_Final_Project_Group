/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartAPI, enrollmentsAPI } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

/**
 * Cart = courses the student intends to enroll in (stored on backend as registeredCourses).
 * Enrolled = courses already enrolled (from enrollments API).
 */
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthed, user } = useAuth();
  const [cart, setCart] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart and enrolled courses when user logs in
  const fetchCartAndEnrollments = useCallback(async () => {
    if (!isAuthed) {
      setCart([]);
      setEnrolled([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch cart (registered courses)
      const cartData = await cartAPI.get();
      if (cartData.success) {
        // Transform backend course format to frontend format
        const cartCourses = (cartData.courses || []).map(transformCourse);
        setCart(cartCourses);
      }

      // Fetch enrolled courses (only for students)
      if (user?.role === "student") {
        try {
          const enrolledData = await enrollmentsAPI.getMyCourses();
          if (enrolledData.success) {
            const enrolledCourses = (enrolledData.enrollments || [])
              .map((e) => transformCourse(e.course))
              .filter(Boolean);
            setEnrolled(enrolledCourses);
          }
        } catch {
          // Enrollments might fail if user has none, that's ok
          setEnrolled([]);
        }
      }
    } catch (err) {
      console.error("Error fetching cart/enrollments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthed, user?.role]);

  // Load cart when auth state changes
  useEffect(() => {
    fetchCartAndEnrollments();
  }, [fetchCartAndEnrollments]);

  // Transform backend course format to frontend format
  const transformCourse = (course) => {
    if (!course) return null;
    return {
      id: course._id,
      name: course.courseName,
      courseNumber: course.courseNumber,
      description: course.description,
      subject: course.subjectArea,
      credits: course.credits,
      teacher: course.teacher,
      maxStudents: course.maxStudents,
      currentEnrollment: course.currentEnrollment,
      semester: course.semester,
      year: course.year,
      // Keep original for backend calls
      _original: course,
    };
  };

  const addToCart = async (course) => {
    if (!isAuthed) {
      setError("Please log in to add courses to cart");
      return { success: false, message: "Not authenticated" };
    }

    // Check duplicates locally first
    const courseId = course._id || course.id;
    if (cart.some((c) => c.id === courseId)) {
      return { success: false, message: "Course already in cart" };
    }
    if (enrolled.some((c) => c.id === courseId)) {
      return { success: false, message: "Already enrolled in this course" };
    }

    try {
      const data = await cartAPI.add(courseId);
      if (data.success) {
        // Refresh cart from server to ensure consistency
        await fetchCartAndEnrollments();
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const removeFromCart = async (courseId) => {
    if (!isAuthed) return { success: false, message: "Not authenticated" };

    try {
      const data = await cartAPI.remove(courseId);
      if (data.success) {
        // Update local state immediately for better UX
        setCart((prev) => prev.filter((c) => c.id !== courseId));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const clearCart = async () => {
    if (!isAuthed) return;

    // Remove all items one by one (backend doesn't have bulk clear)
    try {
      for (const course of cart) {
        await cartAPI.remove(course.id);
      }
      setCart([]);
    } catch (err) {
      setError(err.message);
      // Refresh to get accurate state
      await fetchCartAndEnrollments();
    }
  };

  const enrollInCourse = async (courseId) => {
    if (!isAuthed) return { success: false, message: "Not authenticated" };

    try {
      const data = await enrollmentsAPI.enroll(courseId);
      if (data.success) {
        // Remove from cart
        await cartAPI.remove(courseId).catch(() => {});
        // Refresh to update both cart and enrolled
        await fetchCartAndEnrollments();
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const enrollAll = async () => {
    if (!isAuthed || cart.length === 0) {
      return { success: false, message: "No courses to enroll" };
    }

    const results = { enrolled: [], failed: [] };

    for (const course of cart) {
      try {
        const result = await enrollInCourse(course.id);
        if (result.success) {
          results.enrolled.push(course);
        } else {
          results.failed.push({ course, reason: result.message });
        }
      } catch (err) {
        results.failed.push({ course, reason: err.message });
      }
    }

    return {
      success: results.failed.length === 0,
      enrolled: results.enrolled,
      failed: results.failed,
    };
  };

  const dropCourse = async (courseId) => {
    if (!isAuthed) return { success: false, message: "Not authenticated" };

    try {
      const data = await enrollmentsAPI.drop(courseId);
      if (data.success) {
        setEnrolled((prev) => prev.filter((c) => c.id !== courseId));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const value = {
    cart,
    enrolled,
    loading,
    error,
    addToCart,
    removeFromCart,
    clearCart,
    enrollInCourse,
    enrollAll,
    dropCourse,
    refreshCart: fetchCartAndEnrollments,
    // Legacy support
    markEnrolled: enrollAll,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
