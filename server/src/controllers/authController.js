const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const supabase = require('../config/supabase');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const signSendTokens = async (session, user, statusCode, res) => {
  const { access_token, refresh_token } = session;

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  };

  res.cookie('refreshToken', refresh_token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
      accessToken: access_token
    }
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, state, userType } = req.body;

  // 1) Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return next(new AppError(authError.message, 400));
  }

  // 2) Create user in our DB using the Supabase UUID
  let newUser;
  try {
    newUser = await prisma.user.create({
      data: {
        id: authData.user.id,
        name,
        email,
        state,
        userType,
        isVerified: true, // Assuming auto-verify for testing
      }
    });
  } catch (err) {
    // If Prisma fails, delete the Supabase user to maintain consistency
    await supabase.auth.admin.deleteUser(authData.user.id);
    return next(new AppError('Failed to create user record. Email might already exist.', 400));
  }

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
      message: 'Registration successful!'
    }
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Email verification is handled by Supabase.'
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 1) Sign in with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 2) Get user from Prisma
  const user = await prisma.user.findUnique({
    where: { id: data.user.id }
  });

  if (!user) {
    return next(new AppError('User record not found in database', 404));
  }

  // 3) Send tokens
  await signSendTokens(data.session, user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    // We use the admin api to sign out a specific JWT if needed, or just rely on client-side cleanup
    await supabase.auth.admin.signOut(token).catch(() => {});
  }

  res.clearCookie('refreshToken');
  res.status(204).json({ status: 'success' });
});

exports.refresh = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new AppError('Not authenticated', 401));
  }

  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

  if (error || !data.session) {
    return next(new AppError('Invalid refresh token', 401));
  }

  res.status(200).json({ 
    status: 'success', 
    accessToken: data.session.access_token 
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: process.env.CLIENT_URL + '/reset-password',
  });

  if (error) {
    return next(new AppError(error.message, 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'Password reset link sent to email!'
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  res.status(400).json({
    status: 'fail',
    message: 'Please implement password reset directly on the frontend using Supabase client.'
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { newPassword } = req.body;
  
  if (!req.user) {
    return next(new AppError('Not authenticated', 401));
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(req.user.id, { password: newPassword });

  if (updateError) {
    return next(new AppError(updateError.message, 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully'
  });
});
