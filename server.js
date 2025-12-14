import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // allow frontend (Vite) to talk to backend
app.use(express.json()); // parse JSON bodies

// ===== "Database" (for now just in-memory) =====
let courses = [
  {
    id: 1,
    courseName: "Intro to Programming",
    description: "Learn the basics of programming.",
    subjectArea: "Computer Science",
    credits: 3,
  },
];

let nextId = 2;

// ✅ Root route so http://localhost:3000/ doesn't say "Cannot GET /"
app.get("/", (req, res) => {
  res.send("API is running. Try GET /api/courses");
});

// ===== CRUD ROUTES =====

// GET: all courses
app.get("/api/courses", (req, res) => {
  res.json(courses);          // ✅ return the array, not a string
});

// POST: add new course
app.post("/api/courses", (req, res) => {
  const { courseName, description, subjectArea, credits } = req.body;

  if (!courseName || !description || !subjectArea || credits === undefined) {
    return res
      .status(400)
      .json({
        message: "courseName, description, subjectArea, credits are required",
      });
  }

  const newCourse = {
    id: nextId++,
    courseName,
    description,
    subjectArea,
    credits: Number(credits),
  };

  courses.push(newCourse);
  res.status(201).json(newCourse);
});

// PUT: update existing course by id
app.put("/api/courses/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = courses.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Course not found" });
  }

  const { courseName, description, subjectArea, credits } = req.body;
  courses[index] = {
    id,
    courseName: courseName ?? courses[index].courseName,
    description: description ?? courses[index].description,
    subjectArea: subjectArea ?? courses[index].subjectArea,
    credits: credits !== undefined ? Number(credits) : courses[index].credits,
  };

  res.json(courses[index]);
});

// DELETE: remove course by id
app.delete("/api/courses/:id", (req, res) => {
  const id = Number(req.params.id);
  const beforeLength = courses.length;
  courses = courses.filter((c) => c.id !== id);

  if (courses.length === beforeLength) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.json({ message: "Course deleted" });
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
