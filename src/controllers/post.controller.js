const Post = require('../models/Post');
const paginate = require('../services/pagination');

const listPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await paginate(Post, {}, {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: {
        path: 'author',
        select: 'name email avatar',
      },
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, body } = req.body;

    const post = await Post.create({
      title,
      body,
      author: req.user._id,
    });

    await post.populate('author', 'name email avatar');

    return res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'name email avatar'
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { title, body } = req.body;

    const post = await Post.findOne({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or you are not authorized to update it',
      });
    }

    if (title !== undefined) post.title = title;
    if (body !== undefined) post.body = body;

    await post.save();
    await post.populate('author', 'name email avatar');

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or you are not authorized to delete it',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
};
