const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const environment = require('../config/environment');

const templateCache = new Map();

const getCompiledTemplate = (templateName) => {
  if (templateCache.has(templateName)) {
    return templateCache.get(templateName);
  }

  const templatePath = path.join(__dirname, '..', 'templates', 'emails', `${templateName}.hbs`);
  const templateSource = fs.readFileSync(templatePath, 'utf-8');
  const compiled = handlebars.compile(templateSource);
  templateCache.set(templateName, compiled);
  return compiled;
};

const createTransporter = () => {
  if (!environment.SMTP_USER || !environment.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: environment.SMTP_HOST,
    port: environment.SMTP_PORT,
    secure: environment.SMTP_PORT === 465,
    auth: {
      user: environment.SMTP_USER,
      pass: environment.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

const sendPasswordResetEmail = async ({ to, resetToken, userName = 'there' }) => {
  const resetUrl = `${environment.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const transporter = createTransporter();

  if (!transporter) {
    return {
      sent: false,
      resetUrl,
    };
  }

  const template = getCompiledTemplate('password-reset');
  const html = template({
    title: 'Reset Your Password - Note Platform',
    appName: 'Note Platform',
    userName,
    resetUrl,
    year: new Date().getFullYear(),
  });

  const fromAddress = environment.SMTP_FROM || environment.SMTP_USER;
  const fromName = environment.SMTP_FROM_NAME || 'Arafat';

  const mailOptions = {
    from: `"${fromName}" <${fromAddress}>`,
    to,
    subject: 'Reset Your Password - Note Platform',
    html,
    text: `Hello ${userName},\n\nYou requested to reset your password for Note Platform. Use the following link to choose a new password: ${resetUrl}\n\nThis link is valid for 1 hour. If you did not request this, please ignore this email.`,
  };

  const info = await transporter.sendMail(mailOptions);
  return {
    sent: true,
    messageId: info.messageId,
  };
};

const sendWelcomeEmail = async ({ to, userName = 'User' }) => {
  const transporter = createTransporter();
  if (!transporter) return { sent: false };

  const template = getCompiledTemplate('welcome');
  const html = template({
    appName: 'Note Platform',
    userName,
    loginUrl: `${environment.FRONTEND_URL}/login`,
    year: new Date().getFullYear(),
  });

  const fromAddress = environment.SMTP_FROM || environment.SMTP_USER;
  const fromName = environment.SMTP_FROM_NAME || 'Arafat';

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to,
    subject: 'Welcome to Note Platform!',
    html,
    text: `Welcome, ${userName}!\n\nThank you for joining Note Platform. Visit ${environment.FRONTEND_URL}/login to get started.`,
  });

  return {
    sent: true,
    messageId: info.messageId,
  };
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
