const mongoose = require('mongoose');
const User = require('../models/User');
const Note = require('../models/Note');
const paginate = require('../services/pagination');

const listUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;

    const filter = {};

    if (role && ['user', 'admin'].includes(role)) {
      filter.role = role;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
      ];
    }

    const result = await paginate(User, filter, {
      page,
      limit,
      sort: { role: 1, createdAt: -1 },
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, interests } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email address',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      interests: interests || [],
    });

    return res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        interests: user.interests,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        interests: user.interests,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, role, isActive, interests } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name !== undefined) user.name = name;
    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (interests !== undefined) user.interests = interests;

    await user.save();

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        interests: user.interests,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const listAllNotes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, userId = '' } = req.query;

    const filter = {};
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      filter.author = userId;
    }

    const result = await paginate(Note, filter, {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: {
        path: 'author',
        select: 'name email',
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

const usersGroupedByInterests = async (req, res, next) => {
  try {
    const result = await User.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$interests' },
      {
        $group: {
          _id: '$interests',
          count: { $sum: 1 },
          users: {
            $push: {
              _id: '$_id',
              name: '$name',
              email: '$email',
            },
          },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          interest: '$_id',
          count: 1,
          users: 1,
          _id: 0,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const userPostsLookup = async (req, res, next) => {
  try {
    const result = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'author',
          as: 'posts',
          pipeline: [
            { $sort: { createdAt: -1 } },
            { $project: { title: 1, body: 1, createdAt: 1 } },
          ],
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          posts: 1,
        },
      },
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  listAllNotes,
  usersGroupedByInterests,
  userPostsLookup,
};
