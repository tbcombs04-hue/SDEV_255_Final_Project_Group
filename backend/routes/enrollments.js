const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/enrollments/:courseId
// @desc    Enroll in a course (Students only)
// @access  Private (Student)
router.post('/:courseId', protect, authorize('student'), async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if course is full
    if (course.currentEnrollment >= course.maxStudents) {
      return res.status(400).json({
        success: false,
        message: 'Course is full'
      });
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      status: 'enrolled'
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId
    });

    // Update course enrollment count
    course.currentEnrollment += 1;
    await course.save();

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('course', 'courseName courseNumber description subjectArea credits semester')
      .populate('student', 'name email');

    res.status(201).json({
      success: true,
      enrollment: populatedEnrollment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while enrolling in course'
    });
  }
});

// @route   DELETE /api/enrollments/:courseId
// @desc    Drop a course (Students only)
// @access  Private (Student)
router.delete('/:courseId', protect, authorize('student'), async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.user.id;

    // Find active enrollment
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      status: 'enrolled'
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found or already dropped'
      });
    }

    // Update enrollment status
    enrollment.status = 'dropped';
    await enrollment.save();

    // Update course enrollment count
    const course = await Course.findById(courseId);
    if (course && course.currentEnrollment > 0) {
      course.currentEnrollment -= 1;
      await course.save();
    }

    res.status(200).json({
      success: true,
      message: 'Course dropped successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while dropping course'
    });
  }
});

// @route   GET /api/enrollments/my-courses
// @desc    Get all courses enrolled by the logged-in student
// @access  Private (Student)
router.get('/my-courses', protect, authorize('student'), async (req, res) => {
  try {
    const studentId = req.user.id;

    const enrollments = await Enrollment.find({
      student: studentId,
      status: 'enrolled'
    })
      .populate({
        path: 'course',
        select: 'courseName courseNumber description subjectArea credits semester year',
        populate: {
          path: 'teacher',
          select: 'name email'
        }
      })
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching enrolled courses'
    });
  }
});

// @route   GET /api/enrollments/course/:courseId/students
// @desc    Get all students enrolled in a specific course (Teachers only)
// @access  Private (Teacher)
router.get('/course/:courseId/students', protect, authorize('teacher'), async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const enrollments = await Enrollment.find({
      course: courseId,
      status: 'enrolled'
    })
      .populate('student', 'name email studentId')
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      course: {
        courseName: course.courseName,
        courseNumber: course.courseNumber
      },
      students: enrollments.map(e => ({
        enrollmentId: e._id,
        studentId: e.student._id,
        name: e.student.name,
        email: e.student.email,
        studentNumber: e.student.studentId,
        enrolledAt: e.enrolledAt
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching enrolled students'
    });
  }
});

module.exports = router;

