const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const environment = require('../config/environment');

const googleClient = new OAuth2Client(environment.GOOGLE_CLIENT_ID);

const generateTokens = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, environment.JWT_SECRET, {
    expiresIn: environment.JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign({ id: user._id }, environment.JWT_REFRESH_SECRET, {
    expiresIn: environment.JWT_REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, environment.JWT_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, environment.JWT_REFRESH_SECRET);
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (candidatePassword, hashedPassword) => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

const verifyGoogleToken = async (idToken) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: environment.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name || payload.email.split('@')[0],
    avatar: payload.picture || '',
  };
};

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  hashPassword,
  comparePassword,
  verifyGoogleToken,
};
