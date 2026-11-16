const { body } = require('express-validator');

const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array of strings'),
  body('interests.*')
    .optional()
    .isString()
    .trim()
    .withMessage('Each interest must be a string'),
  body('avatar')
    .optional()
    .isString()
    .trim()
    .withMessage('Avatar must be a valid string URL or path'),
];

const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long'),
];

module.exports = {
  updateProfileValidator,
  changePasswordValidator,
};
