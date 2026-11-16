const crypto = require('crypto');
const User = require('../models/User');
const {
  generateTokens,
  verifyRefreshToken,
  verifyGoogleToken,
} = require('../services/auth.service');
const { sendPasswordResetEmail } = require('../services/email.service');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

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
    });

    const tokens = generateTokens(user);

    return res.status(201).json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        interests: user.interests,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'This account was registered using Google. Please log in with Google.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const tokens = generateTokens(user);

    return res.status(200).json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        interests: user.interests,
      },
    });
  } catch (error) {
    next(error);
  }
};

const googleAuth = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const googlePayload = await verifyGoogleToken(idToken);

    let user = await User.findOne({
      $or: [{ googleId: googlePayload.googleId }, { email: googlePayload.email }],
    });

    if (user) {
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated',
        });
      }

      let hasModifications = false;
      if (!user.googleId) {
        user.googleId = googlePayload.googleId;
        hasModifications = true;
      }
      if (!user.avatar && googlePayload.avatar) {
        user.avatar = googlePayload.avatar;
        hasModifications = true;
      }
      if (hasModifications) {
        await user.save();
      }
    } else {
      user = await User.create({
        name: googlePayload.name,
        email: googlePayload.email,
        googleId: googlePayload.googleId,
        avatar: googlePayload.avatar,
      });
    }

    const tokens = generateTokens(user);

    return res.status(200).json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        interests: user.interests,
      },
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }

    const tokens = generateTokens(user);

    return res.status(200).json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
    });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      user.passwordResetToken = hashedToken;
      user.passwordResetExpires = Date.now() + 3600000;
      await user.save({ validateBeforeSave: false });

      await sendPasswordResetEmail({
        to: user.email,
        resetToken,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to email if account exists',
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token is invalid or has expired',
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      interests: req.user.interests,
      createdAt: req.user.createdAt,
    },
  });
};

module.exports = {
  register,
  login,
  googleAuth,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
  getMe,
};
