const AppError = require('../utils/AppError');
const { verifyAccessToken } = require('../utils/tokenUtils');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

module.exports = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
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

  // 2) Verification token
  const decoded = verifyAccessToken(token);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id).select('+role +isVerified');
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
