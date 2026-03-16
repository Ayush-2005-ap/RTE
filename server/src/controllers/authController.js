const bcrypt = require('bcryptjs');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const {
  generateAccessToken,
  generateRefreshToken,
  generateHashToken,
  hashToken
} = require('../utils/tokenUtils');

const signSendTokens = async (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // Hash refresh token to store in DB
  const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
  user.refreshTokenHash = refreshTokenHash;
  await user.save({ validateBeforeSave: false });

  const cookieOptions = {
    expires: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  // Remove password and other sensitive fields from output
  user.passwordHash = undefined;
  user.refreshTokenHash = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
      accessToken
    }
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, state, userType } = req.body;

  // 1) Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  const verifyTokenRaw = generateHashToken();
  const verifyToken = hashToken(verifyTokenRaw);

  const newUser = await User.create({
    name,
    email,
    passwordHash,
    state,
    userType,
    verifyToken,
    verifyTokenExpiry: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });

  // TODO: Send verification email with verifyTokenRaw

  newUser.passwordHash = undefined;

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
      message: 'Registration successful! Please check your email to verify your account.'
    }
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const hashedToken = hashToken(req.params.token);

  const user = await User.findOne({
    verifyToken: hashedToken,
    verifyTokenExpiry: { $gt: Date.now() }
  }).select('+verifyToken +verifyTokenExpiry');

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.isVerified = true;
  user.verifyToken = undefined;
  user.verifyTokenExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully! You can now log in.'
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+passwordHash +role +isVerified');

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) Check if user is verified
  if (!user.isVerified) {
    return next(new AppError('Please verify your email address first!', 403));
  }

  // 4) If everything ok, send token to client
  await signSendTokens(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  
  if (refreshToken) {
    const user = await User.findOne({ refreshTokenHash: { $exists: true } }); // This is simplified
    if (user) {
      user.refreshTokenHash = undefined;
      await user.save({ validateBeforeSave: false });
    }
  }

  res.clearCookie('refreshToken');
  res.status(204).json({ status: 'success' });
});

exports.refresh = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new AppError('Not authenticated', 401));
  }

  // TODO: Implement refresh token rotation logic properly
  // Find user by refresh token (hashed)
  // ...
  
  res.status(200).json({ status: 'success', message: 'Token refreshed' });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetTokenRaw = generateHashToken();
  const resetToken = hashToken(resetTokenRaw);

  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  // TODO: Send email
  
  res.status(200).json({
    status: 'success',
    message: 'Token sent to email!'
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = hashToken(req.params.token);

  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: Date.now() }
  }).select('+passwordHash');

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  
  user.passwordHash = await bcrypt.hash(req.body.password, 12);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  user.refreshTokenHash = undefined; // Invalidate all refresh tokens
  await user.save();

  // 3) Log the user in, send JWT
  await signSendTokens(user, 200, res);
});
