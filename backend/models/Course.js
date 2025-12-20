const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: [true, 'Please provide a course name'],
    trim: true
  },
  courseNumber: {
    type: String,
    required: [true, 'Please provide a course number'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a course description']
  },
  subjectArea: {
    type: String,
    required: [true, 'Please provide a subject area'],
    trim: true
  },
  credits: {
    type: Number,
    required: [true, 'Please provide number of credits'],
    min: [1, 'Credits must be at least 1'],
    max: [6, 'Credits cannot exceed 6']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maxStudents: {
    type: Number,
    default: 30
  },
  currentEnrollment: {
    type: Number,
    default: 0
  },
  semester: {
    type: String,
    default: 'Fall 2024'
  },
  year: {
    type: Number,
    default: new Date().getFullYear()
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search functionality
courseSchema.index({ courseName: 'text', courseNumber: 'text', subjectArea: 'text' });

module.exports = mongoose.model('Course', courseSchema);

