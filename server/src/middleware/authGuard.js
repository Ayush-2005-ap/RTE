const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const supabase = require('../config/supabase');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = catchAsync(async (req, res, next) => {
  // 1) Get token from headers
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verify token with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }

  // 3) Check if user exists in our DB and get role
  const currentUser = await prisma.user.findUnique({
    where: { id: user.id }
  });

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
