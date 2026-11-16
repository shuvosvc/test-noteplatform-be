const express = require('express');
const {
  getProfile,
  updateProfile,
  changePassword,
} = require('../controllers/user.controller');
const {
  updateProfileValidator,
  changePasswordValidator,
} = require('../validators/user.validator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);

router.put(
  '/profile',
  updateProfileValidator,
  validate,
  updateProfile
);

router.put(
  '/change-password',
  changePasswordValidator,
  validate,
  changePassword
);

module.exports = router;
