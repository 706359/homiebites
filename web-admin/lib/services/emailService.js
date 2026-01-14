


export async function sendEmail(to, subject, html, text = null) {
  
  if (process.env.NODE_ENV === 'development' && !process.env.ENABLE_EMAIL_IN_DEV) {
    console.log(`[Email Service] Development mode - Email sending is disabled.`);
    console.log(`[Email Service] To enable emails in development, set ENABLE_EMAIL_IN_DEV=true in your .env file`);
    console.log(`[Email Service] Email would be sent to ${to}:`);
    console.log(`[Email Service] Subject: ${subject}`);
    
    return { success: true, messageId: 'dev-mode', devMode: true };
  }

  try {
    return await sendViaGmail(to, subject, html, text);
  } catch (error) {
    console.error('[Email Service] Error sending email:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}


async function sendViaGmail(to, subject, html, text) {
  try {
    
    const nodemailer = await import('nodemailer');
    
    
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_APP_PASSWORD, 
      },
    };

    if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
      throw new Error('Gmail SMTP credentials not configured. Please set SMTP_USER and SMTP_PASSWORD (App Password) in your .env file');
    }

    const transporter = nodemailer.default.createTransport(smtpConfig);

    const mailOptions = {
      from: process.env.SMTP_FROM || smtpConfig.auth.user,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), 
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('[Email Service] Error sending email:', error);
    throw error;
  }
}


export async function sendOTPEmail(email, otp, serviceName = 'HomieBites') {
  const subject = `${serviceName} - Password Recovery OTP`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #449031; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .otp-box { background-color: #fff; border: 2px solid #449031; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 8px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .warning { color: #d32f2f; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${serviceName}</h1>
        </div>
        <div class="content">
          <h2>Password Recovery OTP</h2>
          <p>You have requested to reset your password. Use the OTP below to proceed:</p>
          <div class="otp-box">${otp}</div>
          <p><strong>This OTP is valid for 10 minutes.</strong></p>
          <p class="warning">⚠️ Do not share this OTP with anyone. ${serviceName} will never ask for your OTP.</p>
          <p>If you did not request this password reset, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} ${serviceName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(email, subject, html);
}


export async function sendPasswordResetEmail(to, resetUrl, userName = 'User') {
  const subject = 'Password Reset Request - HomieBites Admin';
  const html = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3B82F6; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .button { 
          display: inline-block; 
          padding: 12px 30px; 
          background-color: #3B82F6; 
          color: white; 
          text-decoration: none; 
          border-radius: 5px; 
          margin: 20px 0;
        }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>You requested to reset your password for your HomieBites Admin account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>Or copy this link to your browser:</p>
          <p style="word-break: break-all; color: #3B82F6;">${resetUrl}</p>
          <p><strong>⚠️ This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
        </div>
        <div class="footer">
          <p>© 2025 HomieBites. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>`;

  try {
    const result = await sendEmail(to, subject, html);
    if (result.success && !result.devMode) {
      console.log('Password reset email sent to:', to);
    }
    return result;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}
