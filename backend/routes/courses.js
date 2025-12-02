const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/courses
// @desc    Get all courses with optional search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, subjectArea, semester } = req.query;
    let query = {};

    // Search by course name or course number
    if (search) {
      query.$or = [
        { courseName: { $regex: search, $options: 'i' } },
        { courseNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by subject area
    if (subjectArea) {
      query.subjectArea = { $regex: subjectArea, $options: 'i' };
    }

    // Filter by semester
    if (semester) {
      query.semester = semester;
    }

    const courses = await Course.find(query)
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching courses'
    });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching course'
    });
  }
});

// @route   POST /api/courses
// @desc    Create a new course (Teachers only)
// @access  Private (Teacher)
router.post('/', [
  protect,
  authorize('teacher'),
  body('courseName').notEmpty().withMessage('Course name is required'),
  body('courseNumber').notEmpty().withMessage('Course number is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('subjectArea').notEmpty().withMessage('Subject area is required'),
  body('credits').isInt({ min: 1, max: 6 }).withMessage('Credits must be between 1 and 6')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { courseName, courseNumber, description, subjectArea, credits, maxStudents, semester, year } = req.body;

    // Check if course number already exists
    const existingCourse = await Course.findOne({ courseNumber });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: 'Course with this course number already exists'
      });
    }

    // Create course
    const course = await Course.create({
      courseName,
      courseNumber,
      description,
      subjectArea,
      credits,
      teacher: req.user.id,
      maxStudents,
      semester,
      year
    });

    const populatedCourse = await Course.findById(course._id)
      .populate('teacher', 'name email');

    res.status(201).json({
      success: true,
      course: populatedCourse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating course'
    });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update a course (Teachers only - initially any teacher, later only course creator)
// @access  Private (Teacher)
router.put('/:id', [
  protect,
  authorize('teacher'),
  body('courseName').optional().notEmpty().withMessage('Course name cannot be empty'),
  body('courseNumber').optional().notEmpty().withMessage('Course number cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('subjectArea').optional().notEmpty().withMessage('Subject area cannot be empty'),
  body('credits').optional().isInt({ min: 1, max: 6 }).withMessage('Credits must be between 1 and 6')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // OPTIONAL: Uncomment below to restrict editing to course creator only
    // if (course.teacher.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Not authorized to update this course'
    //   });
    // }

    const { courseName, courseNumber, description, subjectArea, credits, maxStudents, semester, year } = req.body;

    // Update course
    course = await Course.findByIdAndUpdate(
      req.params.id,
      { courseName, courseNumber, description, subjectArea, credits, maxStudents, semester, year },
      { new: true, runValidators: true }
    ).populate('teacher', 'name email');

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating course'
    });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course (Teachers only - initially any teacher, later only course creator)
// @access  Private (Teacher)
router.delete('/:id', protect, authorize('teacher'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // OPTIONAL: Uncomment below to restrict deletion to course creator only
    // if (course.teacher.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Not authorized to delete this course'
    //   });
    // }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting course'
    });
  }
});

// @route   GET /api/courses/teacher/my-courses
// @desc    Get courses created by the logged-in teacher
// @access  Private (Teacher)
router.get('/teacher/my-courses', protect, authorize('teacher'), async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user.id })
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching teacher courses'
    });
  }
});

module.exports = router;

