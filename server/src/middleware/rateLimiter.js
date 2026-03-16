const rateLimit = require('express-rate-limit');

exports.authLimiter = rateLimit({
  max: 5,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in 15 minutes!'
});

exports.apiLimiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in 15 minutes!'
});

exports.uploadLimiter = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Daily upload limit reached for this user, please try again in an hour!'
});

exports.searchLimiter = rateLimit({
  max: 30,
  windowMs: 60 * 1000, // 1 minute
  message: 'Too many search requests, please slow down!'
});
