const Note = require('../models/Note');
const paginate = require('../services/pagination');

const listNotes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const filter = {
      author: req.user._id,
    };

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
      ];
    }

    const result = await paginate(Note, filter, {
      page,
      limit,
      sort: { createdAt: -1 },
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const createNote = async (req, res, next) => {
  try {
    const { title, content, tags, isPinned } = req.body;

    const note = await Note.create({
      title,
      content,
      tags: tags || [],
      isPinned: isPinned || false,
      author: req.user._id,
    });

    return res.status(201).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

const getNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    return res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const { title, content, tags, isPinned } = req.body;

    const note = await Note.findOne({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();

    return res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listNotes,
  createNote,
  getNote,
  updateNote,
  deleteNote,
};
