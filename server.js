import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ===== In-memory data (swap for MongoDB later) =====
let nextCourseId = 4;
let courses = [
  {
    id: 1,
    courseName: "Intro to Programming",
    description: "Learn the basics of programming.",
    subjectArea: "Computer Science",
    credits: 3,
  },
  {
    id: 2,
    courseName: "Web Development",
    description: "Build websites using HTML, CSS, and JavaScript.",
    subjectArea: "Computer Science",
    credits: 3,
  },
  {
    id: 3,
    courseName: "Database Systems",
    description: "Introduction to databases and SQL.",
    subjectArea: "Information Systems",
    credits: 3,
  },
];

// enrollmentsByUserEmail: { [email]: Set(courseId) }
const enrollmentsByUserEmail = new Map();

// ===== Courses API =====

// GET all courses
app.get("/api/courses", (req, res) => {
  res.json(courses);
});

// GET one course
app.get("/api/courses/:id", (req, res) => {
  const id = Number(req.params.id);
  const course = courses.find((c) => c.id === id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json(course);
});

// POST add new course
app.post("/api/courses", (req, res) => {
  const { courseName, description, subjectArea, credits } = req.body;

  if (!courseName || !description || !subjectArea || credits === undefined) {
    return res.status(400).json({
      message: "courseName, description, subjectArea, credits are required",
    });
  }

  const newCourse = {
    id: nextCourseId++,
    courseName: String(courseName),
    description: String(description),
    subjectArea: String(subjectArea),
    credits: Number(credits),
  };

  courses.push(newCourse);
  res.status(201).json(newCourse);
});

// PUT update a course
app.put("/api/courses/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = courses.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ message: "Course not found" });

  const { courseName, description, subjectArea, credits } = req.body;
  courses[idx] = {
    ...courses[idx],
    ...(courseName !== undefined ? { courseName: String(courseName) } : {}),
    ...(description !== undefined ? { description: String(description) } : {}),
    ...(subjectArea !== undefined ? { subjectArea: String(subjectArea) } : {}),
    ...(credits !== undefined ? { credits: Number(credits) } : {}),
  };

  res.json(courses[idx]);
});

// DELETE a course
app.delete("/api/courses/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = courses.length;
  courses = courses.filter((c) => c.id !== id);
  if (courses.length === before) return res.status(404).json({ message: "Course not found" });
  res.status(204).send();
});

// ===== Enrollments API (duplicate-safe) =====

// POST enroll (accepts courseIds array)
app.post("/api/enrollments", (req, res) => {
  const { userEmail, courseIds } = req.body;

  if (!userEmail || !Array.isArray(courseIds)) {
    return res.status(400).json({ message: "userEmail and courseIds[] are required" });
  }

  const email = String(userEmail).toLowerCase();
  const set = enrollmentsByUserEmail.get(email) ?? new Set();

  const added = [];
  const duplicates = [];

  for (const rawId of courseIds) {
    const id = Number(rawId);
    if (!Number.isFinite(id)) continue;

    if (set.has(id)) {
      duplicates.push(id);
    } else {
      set.add(id);
      added.push(id);
    }
  }

  enrollmentsByUserEmail.set(email, set);

  res.json({
    success: true,
    added,
    duplicates,
    enrolledCourseIds: Array.from(set),
  });
});

// GET enrollments for a user
app.get("/api/enrollments", (req, res) => {
  const email = String(req.query.userEmail || "").toLowerCase();
  if (!email) return res.status(400).json({ message: "userEmail query param required" });

  const set = enrollmentsByUserEmail.get(email) ?? new Set();
  res.json({ userEmail: email, enrolledCourseIds: Array.from(set) });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
