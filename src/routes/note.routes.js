const express = require('express');
const {
  listNotes,
  createNote,
  getNote,
  updateNote,
  deleteNote,
} = require('../controllers/note.controller');
const {
  createNoteValidator,
  updateNoteValidator,
  noteIdValidator,
} = require('../validators/note.validator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.use(authenticate);
router.use(authorize('user', 'admin'));

router.get('/', listNotes);

router.post(
  '/',
  createNoteValidator,
  validate,
  createNote
);

router.get(
  '/:id',
  noteIdValidator,
  validate,
  getNote
);

router.put(
  '/:id',
  updateNoteValidator,
  validate,
  updateNote
);

router.delete(
  '/:id',
  noteIdValidator,
  validate,
  deleteNote
);

module.exports = router;
