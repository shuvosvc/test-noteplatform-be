const dotenv = require('dotenv');

dotenv.config();

const environment = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '1064748421416-enkuk4h8pklfr20lmlepkrjkc79bf4cg.apps.googleusercontent.com',
  SMTP_HOST: process.env.SMTP_HOST || process.env.SES_HOST || process.env.MAIL_HOST || 'email-smtp.us-east-1.amazonaws.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || process.env.SES_PORT || process.env.MAIL_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || process.env.SES_USER || process.env.MAIL_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || process.env.SES_PASS || process.env.MAIL_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || process.env.SES_FROM || process.env.MAIL_FROM || 'no-reply@trialvo.com',
  SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || process.env.SES_FROM_NAME || 'Arafat',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
});

module.exports = environment;
