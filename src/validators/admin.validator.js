const { body, param } = require('express-validator');

const createUserValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email address is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array of strings'),
  body('interests.*')
    .optional()
    .isString()
    .trim()
    .withMessage('Each interest must be a string'),
];

const updateUserValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array of strings'),
  body('interests.*')
    .optional()
    .isString()
    .trim()
    .withMessage('Each interest must be a string'),
];

const userIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),
];

module.exports = {
  createUserValidator,
  updateUserValidator,
  userIdValidator,
};
