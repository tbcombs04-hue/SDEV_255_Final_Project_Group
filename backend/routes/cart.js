const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users/cart
// @desc    Get current user's registered courses (cart)
// @access  Private (Student)
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'registeredCourses',
        populate: {
          path: 'teacher',
          select: 'name email'
        }
      });

    res.status(200).json({
      success: true,
      count: user.registeredCourses.length,
      courses: user.registeredCourses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cart'
    });
  }
});

// @route   POST /api/users/cart
// @desc    Add a course to the user's cart (register for course)
// @access  Private (Student)
router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Get user
    const user = await User.findById(req.user.id);

    // Check if course is already in cart (prevent duplicates)
    if (user.registeredCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Course is already in your schedule'
      });
    }

    // Add course to cart using $addToSet to prevent duplicates
    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { registeredCourses: courseId } },
      { new: true }
    );

    // Get updated user with populated courses
    const updatedUser = await User.findById(req.user.id)
      .populate({
        path: 'registeredCourses',
        populate: {
          path: 'teacher',
          select: 'name email'
        }
      });

    res.status(200).json({
      success: true,
      message: 'Course added to your schedule',
      courses: updatedUser.registeredCourses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding course to cart'
    });
  }
});

// @route   DELETE /api/users/cart/:courseId
// @desc    Remove a course from the user's cart (drop course)
// @access  Private (Student)
router.delete('/:courseId', protect, authorize('student'), async (req, res) => {
  try {
    const { courseId } = req.params;

    // Get user
    const user = await User.findById(req.user.id);

    // Check if course is in cart
    if (!user.registeredCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Course is not in your schedule'
      });
    }

    // Remove course from cart
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { registeredCourses: courseId } },
      { new: true }
    );

    // Get updated user with populated courses
    const updatedUser = await User.findById(req.user.id)
      .populate({
        path: 'registeredCourses',
        populate: {
          path: 'teacher',
          select: 'name email'
        }
      });

    res.status(200).json({
      success: true,
      message: 'Course removed from your schedule',
      courses: updatedUser.registeredCourses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing course from cart'
    });
  }
});

module.exports = router;

