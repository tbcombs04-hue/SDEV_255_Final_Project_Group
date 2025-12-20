import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { coursesAPI } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

function AddCourse() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    courseName: "",
    courseNumber: "",
    description: "",
    subjectArea: "",
    credits: 3,
    maxStudents: 30,
    semester: "Spring 2025",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "credits" || name === "maxStudents" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.courseName.trim()) {
      setError("Course name is required");
      setLoading(false);
      return;
    }
    if (!formData.courseNumber.trim()) {
      setError("Course number is required");
      setLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      setLoading(false);
      return;
    }
    if (!formData.subjectArea.trim()) {
      setError("Subject area is required");
      setLoading(false);
      return;
    }

    try {
      const data = await coursesAPI.create(formData);
      
      if (data.success) {
        navigate("/courses");
      } else {
        setError(data.message || "Failed to create course");
      }
    } catch (err) {
      setError(err.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  // Only teachers can add courses
  if (user?.role !== "teacher") {
    return (
      <div className="page app-page">
        <h1>Add Course</h1>
        <p className="error-msg">Only teachers can add courses.</p>
      </div>
    );
  }

  return (
    <div className="page app-page">
      <h1>Add New Course</h1>

      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-group">
          <label htmlFor="courseName">Course Name *</label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            placeholder="e.g., Introduction to Web Development"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="courseNumber">Course Number *</label>
          <input
            type="text"
            id="courseNumber"
            name="courseNumber"
            value={formData.courseNumber}
            onChange={handleChange}
            placeholder="e.g., SDEV255"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter course description..."
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subjectArea">Subject Area *</label>
          <input
            type="text"
            id="subjectArea"
            name="subjectArea"
            value={formData.subjectArea}
            onChange={handleChange}
            placeholder="e.g., Software Development"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="credits">Credits</label>
            <input
              type="number"
              id="credits"
              name="credits"
              value={formData.credits}
              onChange={handleChange}
              min={1}
              max={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxStudents">Max Students</label>
            <input
              type="number"
              id="maxStudents"
              name="maxStudents"
              value={formData.maxStudents}
              onChange={handleChange}
              min={1}
              max={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="semester">Semester</label>
            <select
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
            >
              <option value="Spring 2025">Spring 2025</option>
              <option value="Summer 2025">Summer 2025</option>
              <option value="Fall 2025">Fall 2025</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btnPrimary" disabled={loading}>
            {loading ? "Creating..." : "Create Course"}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate("/courses")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCourse;
