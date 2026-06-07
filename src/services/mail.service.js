const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure:
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === 'true'
      : parseInt(process.env.SMTP_PORT || '587') === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOtpEmail = async (email, otpCode) => {
  const mailOptions = {
    from: `"AUI Network" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your AUI Verification Code',
    text: `Your verification code is: ${otpCode}. It will expire in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2563eb; text-align: center;">AUI Network Authentication</h2>
        <p>Hello,</p>
        <p>Your 4-digit verification code for logging into the AUI Network is:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827;">${otpCode}</span>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This code will expire in 5 minutes. If you did not request this code, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="text-align: center; color: #9ca3af; font-size: 12px;">&copy; 2024 AUI Network. All rights reserved.</p>
      </div>
    `,
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

const sendPendingEmail = async (email, name, role) => {
  const currentYear = new Date().getFullYear();
  const mailOptions = {
    from: `"AUI Talent" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Application with AUI Talent is Pending Review',
    html: `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc; color: #1e293b;">
        <div style="background-color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">AUI Talent</h2>
            <p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Application Under Review</p>
          </div>
          
          <p style="font-size: 16px; line-height: 24px; margin: 0 0 16px 0;">Dear ${name},</p>
          <p style="font-size: 16px; line-height: 24px; margin: 0 0 24px 0;">Thank you for registering with AUI Talent as a <strong>${role}</strong>. Your profile has been successfully created and is currently in a <strong>pending</strong> state.</p>
          
          <div style="background-color: #f1f5f9; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 15px; line-height: 22px; color: #334155; font-weight: 500;">
              Our team at AUI Talent is currently reviewing your application details. You will receive an email notification regarding your application status (approved or rejected) soon.
            </p>
          </div>
          
          <p style="font-size: 15px; line-height: 24px; color: #475569; margin: 0 0 24px 0;">If you have any questions in the meantime, please feel free to reach out to our support team.</p>
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;">
          
          <p style="font-size: 14px; color: #64748b; margin: 0; line-height: 20px;">Best regards,<br><strong>The AUI Talent Team</strong></p>
        </div>
        <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0 0 4px 0;">&copy; ${currentYear} AUI Talent. All rights reserved.</p>
          <p style="margin: 0;">This is an automated system email. Please do not reply directly to this message.</p>
        </div>
      </div>
    `,
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

const sendStatusUpdateEmail = async (email, name, role, status, talentCode) => {
  const currentYear = new Date().getFullYear();
  const isApproved = status === 'approved';
  const subject = isApproved
    ? 'Congratulations! Your AUI Talent Account has been Approved'
    : 'Update on your AUI Talent Application';

  const mailOptions = {
    from: `"AUI Talent" <${process.env.SMTP_USER}>`,
    to: email,
    subject: subject,
    html: `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc; color: #1e293b;">
        <div style="background-color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">AUI Talent</h2>
            <p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Application Status Update</p>
          </div>
          
          <p style="font-size: 16px; line-height: 24px; margin: 0 0 16px 0;">Dear ${name},</p>
          
          ${isApproved ? `
            <p style="font-size: 16px; line-height: 24px; margin: 0 0 24px 0;">We are thrilled to inform you that your application as a <strong>${role}</strong> has been <strong>approved</strong>!</p>
            
            <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 15px; line-height: 22px; color: #166534; font-weight: 500;">
                Welcome to the AUI Talent community! Your account is now active, and you can proceed to log in to access your dashboard.
              </p>
              ${talentCode ? `<p style="margin: 8px 0 0 0; font-size: 14px; color: #166534;"><strong>Your Unique Talent ID:</strong> ${talentCode}</p>` : ''}
            </div>
            
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="https://auitalent.com/login" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 6px; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">Log In to AUI Talent</a>
            </div>
          ` : `
            <p style="font-size: 16px; line-height: 24px; margin: 0 0 24px 0;">Thank you for your interest in joining AUI Talent. We are writing to inform you that, after careful review, your application as a <strong>${role}</strong> was <strong>not approved</strong> at this time.</p>
            
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 15px; line-height: 22px; color: #991b1b; font-weight: 500;">
                Our review team evaluates each profile according to our current network requirements. While we cannot approve your profile at this moment, we appreciate the time you took to submit your application.
              </p>
            </div>
            
            <p style="font-size: 15px; line-height: 24px; color: #475569; margin: 0 0 24px 0;">If you believe this is in error or would like further information, please contact our administrative team.</p>
          `}
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;">
          
          <p style="font-size: 14px; color: #64748b; margin: 0; line-height: 20px;">Best regards,<br><strong>The AUI Talent Team</strong></p>
        </div>
        <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0 0 4px 0;">&copy; ${currentYear} AUI Talent. All rights reserved.</p>
          <p style="margin: 0;">This is an automated system email. Please do not reply directly to this message.</p>
        </div>
      </div>
    `,
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

module.exports = {
  sendOtpEmail,
  sendPendingEmail,
  sendStatusUpdateEmail,
};
