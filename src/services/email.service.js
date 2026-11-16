const nodemailer = require('nodemailer');
const environment = require('../config/environment');

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

const sendPasswordResetEmail = async ({ to, resetToken }) => {
  const resetUrl = `${environment.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const transporter = createTransporter();

  if (!transporter) {
    return {
      sent: false,
      resetUrl,
    };
  }

  const mailOptions = {
    from: `"Note Platform" <${environment.SMTP_USER}>`,
    to,
    subject: 'Password Reset Request - Note Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e293b;">Password Reset Request</h2>
        <p style="color: #475569; font-size: 16px;">You requested to reset your password for Note Platform.</p>
        <p style="color: #475569; font-size: 16px;">Click the button below to reset your password. This link is valid for 1 hour.</p>
        <div style="margin: 25px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">Link: <a href="${resetUrl}" style="color: #4f46e5;">${resetUrl}</a></p>
      </div>
    `,
    text: `You requested to reset your password for Note Platform. Use the following link to reset your password: ${resetUrl}. This link is valid for 1 hour.`,
  };

  const info = await transporter.sendMail(mailOptions);
  return {
    sent: true,
    messageId: info.messageId,
  };
};

module.exports = {
  sendPasswordResetEmail,
};
