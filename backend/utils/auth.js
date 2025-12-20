const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Send token response with populated registered courses
const sendTokenResponse = async (user, statusCode, res) => {
  // Create token
  const token = generateToken(user._id);

  // Get user with populated registered courses
  const populatedUser = await User.findById(user._id)
    .populate({
      path: 'registeredCourses',
      populate: {
        path: 'teacher',
        select: 'name email'
      }
    });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      role: populatedUser.role,
      studentId: populatedUser.studentId,
      teacherId: populatedUser.teacherId,
      registeredCourses: populatedUser.registeredCourses || []
    }
  });
};

module.exports = { generateToken, sendTokenResponse };
