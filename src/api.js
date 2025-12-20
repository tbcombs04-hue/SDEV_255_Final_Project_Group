// API utility for backend communication
const API_BASE_URL = "http://localhost:5000";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// Helper for making authenticated requests
const authFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

// ============ AUTH API ============

export const authAPI = {
  login: async (email, password) => {
    return authFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async ({ name, email, password, role = "student", studentId }) => {
    return authFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role, studentId }),
    });
  },

  getMe: async () => {
    return authFetch("/api/auth/me");
  },
};

// ============ COURSES API ============

export const coursesAPI = {
  getAll: async (search = "") => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return authFetch(`/api/courses${query}`);
  },

  getOne: async (id) => {
    return authFetch(`/api/courses/${id}`);
  },

  create: async (courseData) => {
    return authFetch("/api/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
    });
  },

  update: async (id, courseData) => {
    return authFetch(`/api/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(courseData),
    });
  },

  delete: async (id) => {
    return authFetch(`/api/courses/${id}`, {
      method: "DELETE",
    });
  },

  getTeacherCourses: async () => {
    return authFetch("/api/courses/teacher/my-courses");
  },
};

// ============ CART API ============

export const cartAPI = {
  get: async () => {
    return authFetch("/api/users/cart");
  },

  add: async (courseId) => {
    return authFetch("/api/users/cart", {
      method: "POST",
      body: JSON.stringify({ courseId }),
    });
  },

  remove: async (courseId) => {
    return authFetch(`/api/users/cart/${courseId}`, {
      method: "DELETE",
    });
  },
};

// ============ ENROLLMENTS API ============

export const enrollmentsAPI = {
  enroll: async (courseId) => {
    return authFetch(`/api/enrollments/${courseId}`, {
      method: "POST",
    });
  },

  drop: async (courseId) => {
    return authFetch(`/api/enrollments/${courseId}`, {
      method: "DELETE",
    });
  },

  getMyCourses: async () => {
    return authFetch("/api/enrollments/my-courses");
  },

  getCourseStudents: async (courseId) => {
    return authFetch(`/api/enrollments/course/${courseId}/students`);
  },
};

export default {
  auth: authAPI,
  courses: coursesAPI,
  cart: cartAPI,
  enrollments: enrollmentsAPI,
};

