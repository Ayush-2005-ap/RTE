const bcrypt = require('bcryptjs');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

/**
 * GET /api/v1/users/admins — Admin: list all admins and moderators
 */
exports.getAdminUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({
    role: { $in: ['admin', 'moderator'] }
  }).select('-passwordHash -refreshTokenHash -verifyToken -resetToken').sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

/**
 * POST /api/v1/users/admins — Admin: create a new admin/moderator
 */
exports.createAdminUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!['admin', 'moderator'].includes(role)) {
    return next(new AppError('Role must be admin or moderator', 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('A user with this email already exists', 400));
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    name,
    email,
    passwordHash,
    role,
    isVerified: true  // Admin-created users are auto-verified
  });

  newUser.passwordHash = undefined;

  res.status(201).json({
    status: 'success',
    data: { user: newUser }
  });
});

/**
 * PATCH /api/v1/users/admins/:id — Super Admin: change a user's role
 */
exports.updateAdminUser = catchAsync(async (req, res, next) => {
  const { role } = req.body;

  if (!['admin', 'moderator'].includes(role)) {
    return next(new AppError('Role must be admin or moderator', 400));
  }

  // Prevent admin from changing their own role
  if (req.params.id === req.user.id.toString()) {
    return next(new AppError('You cannot change your own role', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-passwordHash -refreshTokenHash');

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

/**
 * DELETE /api/v1/users/admins/:id — Admin: delete an admin/moderator account
 */
exports.deleteAdminUser = catchAsync(async (req, res, next) => {
  // Prevent self-deletion
  if (req.params.id === req.user.id.toString()) {
    return next(new AppError('You cannot delete your own account', 400));
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  if (!['admin', 'moderator'].includes(user.role)) {
    return next(new AppError('Can only delete admin or moderator accounts from here', 403));
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({ status: 'success', data: null });
});
