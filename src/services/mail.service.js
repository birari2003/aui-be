const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

// ─── Known admin email accounts ──────────────────────────────────────────────
// All accounts share the same SMTP server and password.
const ADMIN_EMAIL_ACCOUNTS = [
  { email: 'verify@auitalent.com',       label: 'Verify — verify@auitalent.com' },
  { email: 'info@auitalent.com',         label: 'Info — info@auitalent.com' },
  { email: 'founder@auitalent.com',      label: 'Founder — founder@auitalent.com' },
  { email: 'partnerships@auitalent.com', label: 'Partnerships — partnerships@auitalent.com' },
  { email: 'support@auitalent.com',      label: 'Support — support@auitalent.com' },
];

// ─── Shared SMTP options ──────────────────────────────────────────────────────
const smtpBase = () => ({
  host: process.env.SMTP_HOST || 'mail.auitalent.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE !== undefined
    ? process.env.SMTP_SECURE === 'true'
    : parseInt(process.env.SMTP_PORT || '465') === 465,
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2',
  },
  pool: true,
  maxConnections: 5,
  rateDelta: 1000,
  rateLimit: 5,
});

/**
 * Create a transporter for any of the known admin email accounts.
 * All share the same password.
 */
const createTransporterForEmail = (fromEmail) => {
  const sharedPass = process.env.SMTP_PASS || 'Aui@2026$';
  return nodemailer.createTransport({
    ...smtpBase(),
    pool: false, // Fresh connection for one-off sends
    auth: { user: fromEmail, pass: sharedPass },
  });
};

// Default transporter for system emails (verify@auitalent.com)
const transporter = nodemailer.createTransport({
  ...smtpBase(),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ─── Helper: generate a unique Message-ID ────────────────────────────────────
const makeMessageId = () => `<${crypto.randomUUID()}@auitalent.com>`;

// ─── Helper: shared deliverability headers ───────────────────────────────────
const deliverabilityHeaders = (senderEmail) => ({
  'Message-ID': makeMessageId(),
  'Date': new Date().toUTCString(),
  'Reply-To': senderEmail,
  'X-Mailer': 'AUI Talent Mailer',
  // Signals to spam filters this is a legit, individual send
  'Precedence': 'bulk',
  'List-Unsubscribe': `<mailto:support@auitalent.com?subject=Unsubscribe>`,
  'X-Entity-Ref-ID': crypto.randomUUID(),
});

// ─── Helper: strip HTML to plain text ────────────────────────────────────────
const htmlToText = (html) =>
  html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&copy;/g, '©')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

// ─── Helper: wrap content in a full deliverability-optimised HTML shell ───────
const buildHtmlEmail = (innerHtml) => `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>AUI Talent</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;">
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px 20px 32px;border-bottom:1px solid #e2e8f0;text-align:center;">
              <span style="font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">AUI Talent</span>
              <p style="margin:4px 0 0 0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">auitalent.com</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${innerHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px 28px 32px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:12px;color:#94a3b8;">© ${new Date().getFullYear()} AUI Talent. All rights reserved.</p>
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                AUI Talent, auitalent.com &nbsp;|&nbsp;
                <a href="mailto:support@auitalent.com" style="color:#64748b;text-decoration:none;">support@auitalent.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ─── sendOtpEmail ─────────────────────────────────────────────────────────────
const sendOtpEmail = async (email, otpCode) => {
  const senderEmail = process.env.SMTP_USER;
  const subject = 'Your AUI Talent Verification Code';

  const innerHtml = `
    <p style="font-size:16px;color:#1e293b;margin:0 0 8px 0;">Hello,</p>
    <p style="font-size:15px;color:#475569;margin:0 0 24px 0;">
      Use the verification code below to complete your sign-in to AUI Talent.
      This code expires in <strong>5 minutes</strong>.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:20px 0;">
          <span style="display:inline-block;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:10px;padding:16px 40px;font-size:36px;font-weight:900;letter-spacing:12px;color:#0f172a;">${otpCode}</span>
        </td>
      </tr>
    </table>
    <p style="font-size:13px;color:#94a3b8;margin:24px 0 0 0;text-align:center;">
      If you did not request this code, you can safely ignore this email.
    </p>`;

  const html = buildHtmlEmail(innerHtml);
  const text = `Your AUI Talent verification code is: ${otpCode}\n\nThis code expires in 5 minutes.\n\nIf you did not request this, please ignore this email.\n\n— AUI Talent Team`;

  const mailOptions = {
    from: `"AUI Talent" <${senderEmail}>`,
    to: email,
    subject,
    text,
    html,
    headers: deliverabilityHeaders(senderEmail),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send verification email');
  }
};

// ─── sendPendingEmail ─────────────────────────────────────────────────────────
const sendPendingEmail = async (email, name, role) => {
  const senderEmail = process.env.SMTP_USER;
  const subject = 'Your AUI Talent Application is Under Review';

  const innerHtml = `
    <p style="font-size:16px;color:#1e293b;margin:0 0 16px 0;">Dear ${name},</p>
    <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 20px 0;">
      Thank you for registering with AUI Talent as a <strong style="color:#0f172a;">${role}</strong>.
      Your profile has been successfully created and is currently <strong style="color:#0f172a;">under review</strong>.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;border-left:4px solid #3b82f6;border-radius:0 6px 6px 0;margin:0 0 20px 0;">
      <tr>
        <td style="padding:16px;">
          <p style="margin:0;font-size:14px;color:#334155;line-height:1.6;">
            Our team is reviewing your application. You will receive a notification once a decision has been made.
          </p>
        </td>
      </tr>
    </table>
    <p style="font-size:14px;color:#64748b;margin:0 0 24px 0;">
      Questions? Write to us at
      <a href="mailto:support@auitalent.com" style="color:#2563eb;text-decoration:none;">support@auitalent.com</a>.
    </p>
    <p style="font-size:14px;color:#64748b;margin:0;">Best regards,<br/><strong style="color:#0f172a;">The AUI Talent Team</strong></p>`;

  const html = buildHtmlEmail(innerHtml);
  const text = `Dear ${name},\n\nThank you for registering with AUI Talent as a ${role}. Your profile is currently under review.\n\nOur team will notify you once a decision has been made.\n\nQuestions? Email us at support@auitalent.com.\n\nBest regards,\nThe AUI Talent Team`;

  const mailOptions = {
    from: `"AUI Talent" <${senderEmail}>`,
    to: email,
    subject,
    text,
    html,
    headers: deliverabilityHeaders(senderEmail),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Pending Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending Pending email:', error);
    throw new Error('Failed to send pending review email');
  }
};

// ─── sendStatusUpdateEmail ────────────────────────────────────────────────────
const sendStatusUpdateEmail = async (email, name, role, status, talentCode) => {
  const senderEmail = process.env.SMTP_USER;
  const isApproved = status === 'approved';
  const subject = isApproved
    ? 'Your AUI Talent Account Has Been Approved'
    : 'Update on Your AUI Talent Application';

  const innerHtml = isApproved
    ? `
      <p style="font-size:16px;color:#1e293b;margin:0 0 16px 0;">Dear ${name},</p>
      <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 20px 0;">
        We are pleased to inform you that your application as a <strong style="color:#0f172a;">${role}</strong> has been <strong style="color:#16a34a;">approved</strong>.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-left:4px solid #22c55e;border-radius:0 6px 6px 0;margin:0 0 20px 0;">
        <tr>
          <td style="padding:16px;">
            <p style="margin:0;font-size:14px;color:#166534;line-height:1.6;">
              Welcome to the AUI Talent community! Your account is now active.
              ${talentCode ? `<br/><strong>Your Talent ID:</strong> ${talentCode}` : ''}
            </p>
          </td>
        </tr>
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
        <tr>
          <td style="border-radius:6px;background:#2563eb;">
            <a href="https://auitalent.com/login" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:6px;">
              Log In to AUI Talent →
            </a>
          </td>
        </tr>
      </table>
      <p style="font-size:14px;color:#64748b;margin:0;">Best regards,<br/><strong style="color:#0f172a;">The AUI Talent Team</strong></p>`
    : `
      <p style="font-size:16px;color:#1e293b;margin:0 0 16px 0;">Dear ${name},</p>
      <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 20px 0;">
        Thank you for your interest in AUI Talent. After careful review, we were unable to approve your application as a <strong style="color:#0f172a;">${role}</strong> at this time.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border-left:4px solid #ef4444;border-radius:0 6px 6px 0;margin:0 0 20px 0;">
        <tr>
          <td style="padding:16px;">
            <p style="margin:0;font-size:14px;color:#991b1b;line-height:1.6;">
              Our team evaluates each application based on current network requirements.
              We appreciate the time you took to apply.
            </p>
          </td>
        </tr>
      </table>
      <p style="font-size:14px;color:#64748b;margin:0 0 24px 0;">
        If you have questions, please reach out at
        <a href="mailto:support@auitalent.com" style="color:#2563eb;text-decoration:none;">support@auitalent.com</a>.
      </p>
      <p style="font-size:14px;color:#64748b;margin:0;">Best regards,<br/><strong style="color:#0f172a;">The AUI Talent Team</strong></p>`;

  const html = buildHtmlEmail(innerHtml);
  const text = isApproved
    ? `Dear ${name},\n\nYour AUI Talent application as a ${role} has been approved!\n\n${talentCode ? `Your Talent ID: ${talentCode}\n\n` : ''}Log in at https://auitalent.com/login\n\nBest regards,\nThe AUI Talent Team`
    : `Dear ${name},\n\nThank you for applying to AUI Talent as a ${role}. After careful review, we were unable to approve your application at this time.\n\nFor questions, contact support@auitalent.com.\n\nBest regards,\nThe AUI Talent Team`;

  const mailOptions = {
    from: `"AUI Talent" <${senderEmail}>`,
    to: email,
    subject,
    text,
    html,
    headers: deliverabilityHeaders(senderEmail),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Status Update Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending Status Update email:', error);
    throw new Error('Failed to send status update email');
  }
};

// ─── sendCustomEmail (bulk broadcast) ────────────────────────────────────────
/**
 * Send a custom broadcast email, optionally from a specific admin account.
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} bodyHtml - Inner HTML content (will be wrapped in shell)
 * @param {string|null} fromEmail - Sender account; defaults to SMTP_USER
 */
const sendCustomEmail = async (to, subject, bodyHtml, fromEmail = null) => {
  const senderEmail = fromEmail || process.env.SMTP_USER;
  const selectedTransporter = fromEmail ? createTransporterForEmail(fromEmail) : transporter;

  const html = buildHtmlEmail(bodyHtml);
  const text = htmlToText(bodyHtml);

  const mailOptions = {
    from: `"AUI Talent" <${senderEmail}>`,
    replyTo: senderEmail,
    to,
    subject,
    text,
    html,
    headers: deliverabilityHeaders(senderEmail),
  };

  try {
    const info = await selectedTransporter.sendMail(mailOptions);
    console.log('Custom Email sent from %s to %s: %s', senderEmail, to, info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending custom email from %s to %s:', senderEmail, to, error);
    throw error;
  }
};

module.exports = {
  sendOtpEmail,
  sendPendingEmail,
  sendStatusUpdateEmail,
  sendCustomEmail,
  ADMIN_EMAIL_ACCOUNTS,
};
