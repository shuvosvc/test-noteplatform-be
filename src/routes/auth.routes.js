const express = require('express');
const {
  register,
  login,
  googleAuth,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
  getMe,
} = require('../controllers/auth.controller');
const {
  registerValidator,
  loginValidator,
  googleValidator,
  refreshValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/auth.validator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const {
  authRateLimiter,
  passwordResetRateLimiter,
} = require('../middleware/rateLimiter');

const router = express.Router();

router.post(
  '/register',
  authRateLimiter,
  registerValidator,
  validate,
  register
);

router.post(
  '/login',
  authRateLimiter,
  loginValidator,
  validate,
  login
);

router.post(
  '/google',
  authRateLimiter,
  googleValidator,
  validate,
  googleAuth
);

router.post(
  '/refresh',
  authRateLimiter,
  refreshValidator,
  validate,
  refreshToken
);

router.post(
  '/forgot-password',
  passwordResetRateLimiter,
  forgotPasswordValidator,
  validate,
  forgotPassword
);

router.post(
  '/reset-password',
  passwordResetRateLimiter,
  resetPasswordValidator,
  validate,
  resetPassword
);

router.post(
  '/logout',
  authenticate,
  logout
);

router.get(
  '/me',
  authenticate,
  getMe
);

module.exports = router;
