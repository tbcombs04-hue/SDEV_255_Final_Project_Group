# Course Management System - API Endpoints Documentation

**Base URL:** `http://localhost:5000`

---

## 🔐 Authentication Endpoints

### 1. Register a New User
**POST** `/api/auth/register`

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",           // "student" or "teacher"
  "studentId": "S12345"        // Optional: For students only
  // OR
  "teacherId": "T001"          // Optional: For teachers only
}
```

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f7a8b9c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "studentId": "S12345"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### 2. Login
**POST** `/api/auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f7a8b9c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "studentId": "S12345"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. Get Current User
**GET** `/api/auth/me`

**Access:** Private (Requires Token)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "65f7a8b9c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "studentId": "S12345"
  }
}
```

---

## 📚 Course Endpoints

### 4. Get All Courses
**GET** `/api/courses`

**Access:** Public

**Query Parameters (Optional):**
- `search` - Search by course name or course number
- `subjectArea` - Filter by subject area
- `semester` - Filter by semester

**Examples:**
- `/api/courses`
- `/api/courses?search=web`
- `/api/courses?subjectArea=Computer Science`
- `/api/courses?search=CS101&semester=Fall 2024`

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "courses": [
    {
      "_id": "65f7a8b9c1234567890abcde",
      "courseName": "Introduction to Web Development",
      "courseNumber": "SDEV255",
      "description": "Learn full-stack web development",
      "subjectArea": "Software Development",
      "credits": 4,
      "maxStudents": 30,
      "currentEnrollment": 5,
      "semester": "Fall 2024",
      "year": 2024,
      "teacher": {
        "_id": "65f7a8b9c1234567890abcde",
        "name": "Dr. Smith",
        "email": "smith@university.edu"
      },
      "createdAt": "2024-12-02T10:30:00.000Z"
    }
  ]
}
```

---

### 5. Get Single Course
**GET** `/api/courses/:id`

**Access:** Public

**Example:** `/api/courses/65f7a8b9c1234567890abcde`

**Success Response (200):**
```json
{
  "success": true,
  "course": {
    "_id": "65f7a8b9c1234567890abcde",
    "courseName": "Introduction to Web Development",
    "courseNumber": "SDEV255",
    "description": "Learn full-stack web development",
    "subjectArea": "Software Development",
    "credits": 4,
    "maxStudents": 30,
    "currentEnrollment": 5,
    "semester": "Fall 2024",
    "year": 2024,
    "teacher": {
      "_id": "65f7a8b9c1234567890abcde",
      "name": "Dr. Smith",
      "email": "smith@university.edu"
    },
    "createdAt": "2024-12-02T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Course not found"
}
```

---

### 6. Create Course
**POST** `/api/courses`

**Access:** Private (Teachers Only)

**Headers:**
```
Authorization: Bearer <teacher_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "courseName": "Introduction to Web Development",
  "courseNumber": "SDEV255",
  "description": "Learn full-stack web development with Node.js and React",
  "subjectArea": "Software Development",
  "credits": 4,
  "maxStudents": 30,          // Optional, defaults to 30
  "semester": "Fall 2024",    // Optional, defaults to "Fall 2024"
  "year": 2024                // Optional, defaults to current year
}
```

**Success Response (201):**
```json
{
  "success": true,
  "course": {
    "_id": "65f7a8b9c1234567890abcde",
    "courseName": "Introduction to Web Development",
    "courseNumber": "SDEV255",
    "description": "Learn full-stack web development with Node.js and React",
    "subjectArea": "Software Development",
    "credits": 4,
    "maxStudents": 30,
    "currentEnrollment": 0,
    "semester": "Fall 2024",
    "year": 2024,
    "teacher": {
      "_id": "65f7a8b9c1234567890abcde",
      "name": "Dr. Smith",
      "email": "smith@university.edu"
    },
    "createdAt": "2024-12-02T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Course with this course number already exists"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "User role 'student' is not authorized to access this route"
}
```

---

### 7. Update Course
**PUT** `/api/courses/:id`

**Access:** Private (Teachers Only)

**Headers:**
```
Authorization: Bearer <teacher_token>
Content-Type: application/json
```

**Request Body:** (All fields optional, only include what you want to update)
```json
{
  "courseName": "Advanced Web Development",
  "description": "Updated description",
  "credits": 5,
  "maxStudents": 25
}
```

**Success Response (200):**
```json
{
  "success": true,
  "course": {
    "_id": "65f7a8b9c1234567890abcde",
    "courseName": "Advanced Web Development",
    "courseNumber": "SDEV255",
    "description": "Updated description",
    "subjectArea": "Software Development",
    "credits": 5,
    "maxStudents": 25,
    "currentEnrollment": 5,
    "semester": "Fall 2024",
    "year": 2024,
    "teacher": {...},
    "createdAt": "2024-12-02T10:30:00.000Z"
  }
}
```

---

### 8. Delete Course
**DELETE** `/api/courses/:id`

**Access:** Private (Teachers Only)

**Headers:**
```
Authorization: Bearer <teacher_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Course not found"
}
```

---

### 9. Get Teacher's Courses
**GET** `/api/courses/teacher/my-courses`

**Access:** Private (Teachers Only)

**Headers:**
```
Authorization: Bearer <teacher_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "courses": [
    {
      "_id": "65f7a8b9c1234567890abcde",
      "courseName": "Introduction to Web Development",
      "courseNumber": "SDEV255",
      "description": "Learn full-stack web development",
      "subjectArea": "Software Development",
      "credits": 4,
      "maxStudents": 30,
      "currentEnrollment": 5,
      "semester": "Fall 2024",
      "year": 2024,
      "teacher": {
        "_id": "65f7a8b9c1234567890abcde",
        "name": "Dr. Smith",
        "email": "smith@university.edu"
      },
      "createdAt": "2024-12-02T10:30:00.000Z"
    }
  ]
}
```

---

## 🎓 Enrollment Endpoints

### 10. Enroll in Course
**POST** `/api/enrollments/:courseId`

**Access:** Private (Students Only)

**Headers:**
```
Authorization: Bearer <student_token>
```

**Example:** `/api/enrollments/65f7a8b9c1234567890abcde`

**Success Response (201):**
```json
{
  "success": true,
  "enrollment": {
    "_id": "65f7a8b9c1234567890abcde",
    "student": {
      "_id": "65f7a8b9c1234567890abcde",
      "name": "John Doe",
      "email": "john@student.edu"
    },
    "course": {
      "_id": "65f7a8b9c1234567890abcde",
      "courseName": "Introduction to Web Development",
      "courseNumber": "SDEV255",
      "description": "Learn full-stack web development",
      "subjectArea": "Software Development",
      "credits": 4,
      "semester": "Fall 2024"
    },
    "enrolledAt": "2024-12-02T10:30:00.000Z",
    "status": "enrolled"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "You are already enrolled in this course"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Course is full"
}
```

---

### 11. Drop Course
**DELETE** `/api/enrollments/:courseId`

**Access:** Private (Students Only)

**Headers:**
```
Authorization: Bearer <student_token>
```

**Example:** `/api/enrollments/65f7a8b9c1234567890abcde`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Course dropped successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Enrollment not found or already dropped"
}
```

---

### 12. Get Student's Enrolled Courses
**GET** `/api/enrollments/my-courses`

**Access:** Private (Students Only)

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "enrollments": [
    {
      "_id": "65f7a8b9c1234567890abcde",
      "course": {
        "_id": "65f7a8b9c1234567890abcde",
        "courseName": "Introduction to Web Development",
        "courseNumber": "SDEV255",
        "description": "Learn full-stack web development",
        "subjectArea": "Software Development",
        "credits": 4,
        "semester": "Fall 2024",
        "year": 2024,
        "teacher": {
          "_id": "65f7a8b9c1234567890abcde",
          "name": "Dr. Smith",
          "email": "smith@university.edu"
        }
      },
      "enrolledAt": "2024-12-02T10:30:00.000Z",
      "status": "enrolled"
    }
  ]
}
```

---

### 13. Get Course Students (Roster)
**GET** `/api/enrollments/course/:courseId/students`

**Access:** Private (Teachers Only)

**Headers:**
```
Authorization: Bearer <teacher_token>
```

**Example:** `/api/enrollments/course/65f7a8b9c1234567890abcde/students`

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "course": {
    "courseName": "Introduction to Web Development",
    "courseNumber": "SDEV255"
  },
  "students": [
    {
      "enrollmentId": "65f7a8b9c1234567890abcde",
      "studentId": "65f7a8b9c1234567890abcde",
      "name": "John Doe",
      "email": "john@student.edu",
      "studentNumber": "S12345",
      "enrolledAt": "2024-12-02T10:30:00.000Z"
    }
  ]
}
```

---

## 🔑 Authentication Flow

### For Frontend Implementation:

1. **Login/Register:**
   - Send credentials to `/api/auth/login` or `/api/auth/register`
   - Store the returned `token` in localStorage or context
   - Store the `user` object (contains role, id, etc.)

2. **Protected Requests:**
   - Include token in Authorization header for all protected routes:
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json'
   }
   ```

3. **Check User Role:**
   - Use the `user.role` to show/hide UI elements
   - `role === 'teacher'` → Show course management features
   - `role === 'student'` → Show enrollment features

4. **Handle Errors:**
   - 401 → Unauthorized (invalid/expired token) → Redirect to login
   - 403 → Forbidden (wrong role) → Show error message
   - 404 → Not found
   - 500 → Server error

---

## 📋 Example Frontend Usage (React/Fetch)

### Login Example:
```javascript
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } else {
    throw new Error(data.message);
  }
};
```

### Get Courses Example:
```javascript
const getCourses = async (searchQuery = '') => {
  const url = searchQuery 
    ? `http://localhost:5000/api/courses?search=${searchQuery}`
    : 'http://localhost:5000/api/courses';
    
  const response = await fetch(url);
  const data = await response.json();
  return data.courses;
};
```

### Create Course Example (Teacher):
```javascript
const createCourse = async (courseData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(courseData),
  });
  
  const data = await response.json();
  return data;
};
```

### Enroll in Course Example (Student):
```javascript
const enrollInCourse = async (courseId) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`http://localhost:5000/api/enrollments/${courseId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  
  const data = await response.json();
  return data;
};
```

---

## 🚨 Common Error Responses

**400 - Bad Request:**
```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "msg": "Email is required",
      "param": "email"
    }
  ]
}
```

**401 - Unauthorized:**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**403 - Forbidden:**
```json
{
  "success": false,
  "message": "User role 'student' is not authorized to access this route"
}
```

**404 - Not Found:**
```json
{
  "success": false,
  "message": "Course not found"
}
```

**500 - Server Error:**
```json
{
  "success": false,
  "message": "Server error"
}
```

---

## 📝 Notes for Frontend Developers

1. **Base URL:** All endpoints start with `http://localhost:5000`
2. **Content-Type:** Always use `application/json` for POST/PUT requests
3. **Authorization:** Include `Bearer <token>` in Authorization header for protected routes
4. **Role-Based UI:** Check `user.role` to show appropriate features
5. **Error Handling:** Always check `response.success` before using data
6. **Search:** Use query parameters for filtering courses
7. **Course ID:** When enrolling/viewing, use the course `_id` field

---

## 🎯 Testing Checklist

- [ ] Register as teacher
- [ ] Register as student
- [ ] Login with both accounts
- [ ] Create multiple courses (teacher)
- [ ] View all courses (public)
- [ ] Search courses by name
- [ ] Filter courses by subject area
- [ ] Update a course (teacher)
- [ ] Delete a course (teacher)
- [ ] Enroll in courses (student)
- [ ] View enrolled courses (student)
- [ ] Drop a course (student)
- [ ] View course roster (teacher)
- [ ] Test authorization (student trying to create course should fail)

---

**Questions?** Contact the backend team!

