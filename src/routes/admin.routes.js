const express = require('express');
const {
  listUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  listAllNotes,
  usersGroupedByInterests,
  userPostsLookup,
} = require('../controllers/admin.controller');
const {
  createUserValidator,
  updateUserValidator,
  userIdValidator,
} = require('../validators/admin.validator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/users/grouped-by-interests', usersGroupedByInterests);

router.get('/users', listUsers);

router.post(
  '/users',
  createUserValidator,
  validate,
  createUser
);

router.get(
  '/users/:id',
  userIdValidator,
  validate,
  getUser
);

router.put(
  '/users/:id',
  updateUserValidator,
  validate,
  updateUser
);

router.delete(
  '/users/:id',
  userIdValidator,
  validate,
  deleteUser
);

router.get(
  '/users/:id/posts',
  userIdValidator,
  validate,
  userPostsLookup
);

router.get('/notes', listAllNotes);

module.exports = router;
