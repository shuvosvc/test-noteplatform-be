const { body, param } = require('express-validator');

const createNoteValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 10000 })
    .withMessage('Content must not exceed 10000 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings'),
  body('tags.*')
    .optional()
    .isString()
    .trim()
    .withMessage('Each tag must be a string'),
  body('isPinned')
    .optional()
    .isBoolean()
    .withMessage('isPinned must be a boolean value'),
];

const updateNoteValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid note ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('content')
    .optional()
    .isLength({ max: 10000 })
    .withMessage('Content must not exceed 10000 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings'),
  body('tags.*')
    .optional()
    .isString()
    .trim()
    .withMessage('Each tag must be a string'),
  body('isPinned')
    .optional()
    .isBoolean()
    .withMessage('isPinned must be a boolean value'),
];

const noteIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid note ID'),
];

module.exports = {
  createNoteValidator,
  updateNoteValidator,
  noteIdValidator,
};
