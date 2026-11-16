const express = require('express');
const {
  listPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} = require('../controllers/post.controller');
const {
  createPostValidator,
  updatePostValidator,
  postIdValidator,
} = require('../validators/post.validator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.use(authenticate);

router.get('/', listPosts);

router.post(
  '/',
  authorize('user', 'admin'),
  createPostValidator,
  validate,
  createPost
);

router.get(
  '/:id',
  postIdValidator,
  validate,
  getPost
);

router.put(
  '/:id',
  authorize('user', 'admin'),
  updatePostValidator,
  validate,
  updatePost
);

router.delete(
  '/:id',
  authorize('user', 'admin'),
  postIdValidator,
  validate,
  deletePost
);

module.exports = router;
