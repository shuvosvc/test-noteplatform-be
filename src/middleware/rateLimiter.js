const rateLimit = require('express-rate-limit');
const environment = require('../config/environment');

const globalRateLimiter = rateLimit({
  windowMs: environment.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: environment.RATE_LIMIT_MAX || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes',
  },
});

const passwordResetRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many password reset requests, please try again after 15 minutes',
  },
});

module.exports = {
  globalRateLimiter,
  authRateLimiter,
  passwordResetRateLimiter,
};
