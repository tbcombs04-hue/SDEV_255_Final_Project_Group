# Course Management System - Backend API

A RESTful API for managing college courses, student enrollments, and teacher administration. Built with Node.js, Express, and MongoDB.

## Features

### Stage 1 - Course Management
- ✅ Teachers can create, view, edit, and delete courses
- ✅ Course information includes: name, number, description, subject area, and credits
- ✅ View all available courses
- ✅ Search and filter courses

### Stage 2 - Authentication & Enrollment
- ✅ User authentication (login/register) with JWT
- ✅ Role-based authorization (Students vs Teachers)
- ✅ Students can search for courses by name or number
- ✅ Students can enroll in and drop courses
- ✅ Students can view their enrolled courses
- ✅ Teachers can view students enrolled in their courses

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/course_management
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # On Windows
   net start MongoDB
   
   # On Mac with Homebrew
   brew services start mongodb-community
   
   # On Linux
   sudo systemctl start mongod
   ```

5. **Run the server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

**Register Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "studentId": "S12345"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Course Routes (`/api/courses`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/courses` | Get all courses (with search) | Public |
| GET | `/api/courses/:id` | Get single course | Public |
| POST | `/api/courses` | Create new course | Teacher |
| PUT | `/api/courses/:id` | Update course | Teacher |
| DELETE | `/api/courses/:id` | Delete course | Teacher |
| GET | `/api/courses/teacher/my-courses` | Get teacher's courses | Teacher |

**Query Parameters for GET /api/courses:**
- `search` - Search by course name or number
- `subjectArea` - Filter by subject area
- `semester` - Filter by semester

**Create Course Request Body:**
```json
{
  "courseName": "Introduction to Computer Science",
  "courseNumber": "CS101",
  "description": "Fundamentals of programming and computer science",
  "subjectArea": "Computer Science",
  "credits": 3,
  "maxStudents": 30,
  "semester": "Fall 2024"
}
```

### Enrollment Routes (`/api/enrollments`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/enrollments/:courseId` | Enroll in a course | Student |
| DELETE | `/api/enrollments/:courseId` | Drop a course | Student |
| GET | `/api/enrollments/my-courses` | Get enrolled courses | Student |
| GET | `/api/enrollments/course/:courseId/students` | Get course students | Teacher |

## Authentication

All private routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

After logging in, you'll receive a token in the response. Include this token in subsequent requests to protected routes.

## Database Models

### User
- name, email, password (hashed)
- role (student/teacher)
- studentId or teacherId
- timestamps

### Course
- courseName, courseNumber, description
- subjectArea, credits
- teacher (reference to User)
- maxStudents, currentEnrollment
- semester, year
- timestamps

### Enrollment
- student (reference to User)
- course (reference to Course)
- status (enrolled/dropped)
- enrolledAt timestamp

## Important Notes

### Stage 1 vs Stage 2
- **Stage 1**: Initially, any teacher can edit or delete any course
- **Stage 2**: To restrict course editing/deletion to only the course creator, uncomment the authorization checks in the course routes (`routes/courses.js`)

Look for these commented sections:
```javascript
// OPTIONAL: Uncomment below to restrict editing to course creator only
// if (course.teacher.toString() !== req.user.id) {
//   return res.status(403).json({
//     success: false,
//     message: 'Not authorized to update this course'
//   });
// }
```

## Testing the API

You can test the API using:
- **Postman**: Import the endpoints and test each route
- **Thunder Client** (VS Code extension)
- **cURL**: Command-line testing

### Example cURL Commands

**Register a Teacher:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Smith",
    "email": "smith@university.edu",
    "password": "password123",
    "role": "teacher",
    "teacherId": "T001"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "smith@university.edu",
    "password": "password123"
  }'
```

**Create a Course (requires token):**
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "courseName": "Web Development",
    "courseNumber": "WEB255",
    "description": "Full stack web development course",
    "subjectArea": "Software Development",
    "credits": 4
  }'
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [] // Validation errors if any
}
```

## Future Enhancements

- Add course schedules (days/times)
- Implement course prerequisites
- Add grade management
- Email notifications for enrollments
- Pagination for large course lists
- Advanced search with multiple filters
- Course capacity waitlist

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection
├── middleware/
│   └── auth.js            # Authentication middleware
├── models/
│   ├── User.js            # User model
│   ├── Course.js          # Course model
│   └── Enrollment.js      # Enrollment model
├── routes/
│   ├── auth.js            # Auth routes
│   ├── courses.js         # Course routes
│   └── enrollments.js     # Enrollment routes
├── utils/
│   └── auth.js            # Auth utilities
├── .gitignore
├── package.json
├── server.js              # Entry point
└── README.md
```

## Contributing

This is a student project for SDEV 255. Please coordinate with your team members before making changes.

## License

ISC

