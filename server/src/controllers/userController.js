const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const supabase = require('../config/supabase');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/v1/users/admins — Admin: list all admins and moderators
 */
exports.getAdminUsers = catchAsync(async (req, res, next) => {
  const users = await prisma.user.findMany({
    where: {
      role: { in: ['admin', 'moderator'] }
    },
    orderBy: { createdAt: 'desc' }
  });

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

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return next(new AppError('A user with this email already exists', 400));
  }

  // 1) Create in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true // auto-verify admins
  });

  if (authError) {
    return next(new AppError(authError.message, 400));
  }

  // 2) Create in Prisma
  let newUser;
  try {
    newUser = await prisma.user.create({
      data: {
        id: authData.user.id,
        name,
        email,
        role,
        isVerified: true
      }
    });
  } catch (err) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    return next(new AppError('Failed to save user in database', 500));
  }

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
  const { id } = req.params;

  if (!['admin', 'moderator'].includes(role)) {
    return next(new AppError('Role must be admin or moderator', 400));
  }

  // Prevent admin from changing their own role
  if (id === req.user.id) {
    return next(new AppError('You cannot change your own role', 400));
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role }
  }).catch(() => null);

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
  const { id } = req.params;

  // Prevent self-deletion
  if (id === req.user.id) {
    return next(new AppError('You cannot delete your own account', 400));
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  if (!['admin', 'moderator'].includes(user.role)) {
    return next(new AppError('Can only delete admin or moderator accounts from here', 403));
  }

  // Delete from Prisma first (due to foreign key constraints if any, actually Prisma handles it if cascading is set, 
  // but wait, if it fails, auth isn't deleted)
  await prisma.user.delete({ where: { id } });
  
  // Delete from Supabase Auth
  await supabase.auth.admin.deleteUser(id);

  res.status(204).json({ status: 'success', data: null });
});
