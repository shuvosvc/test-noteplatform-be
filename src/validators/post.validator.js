const { body, param } = require('express-validator');

const createPostValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('body')
    .notEmpty()
    .withMessage('Body is required')
    .isLength({ max: 20000 })
    .withMessage('Body must not exceed 20000 characters'),
];

const updatePostValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid post ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('body')
    .optional()
    .isLength({ max: 20000 })
    .withMessage('Body must not exceed 20000 characters'),
];

const postIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid post ID'),
];

module.exports = {
  createPostValidator,
  updatePostValidator,
  postIdValidator,
};
