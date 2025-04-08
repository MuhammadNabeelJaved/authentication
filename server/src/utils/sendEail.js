import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});


const sendEmail = async (to, subject, code) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to,
            subject,
            html: `
            <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
  <style>
    /* Reset styles */
    body, html {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      color: #334155;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Container */
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    /* Email wrapper */
    .email-wrapper {
      background-color: #ffffff;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
      overflow: hidden;
    }

    /* Header */
    .header {
      padding: 32px 0;
      text-align: center;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    }

    .logo {
      width: 180px;
      height: auto;
    }

    /* Content */
    .content {
      padding: 40px 32px;
    }

    h1 {
      margin: 0 0 24px;
      font-size: 24px;
      font-weight: 600;
      color: #1e293b;
    }

    p {
      margin: 0 0 20px;
      font-size: 16px;
      line-height: 1.6;
    }

    /* Code box */
    .code-box {
      background-color: #f1f5f9;
      border-radius: 12px;
      padding: 24px;
      margin: 32px 0;
      text-align: center;
    }

    .verification-code {
      font-family: 'Courier New', monospace;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #334155;
      margin: 0;
      padding: 0 0 0 8px; /* Offset letter-spacing */
    }

    /* Verification button */
    .button-container {
      text-align: center;
      margin: 32px 0;
    }

    .button {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #ffffff;
      text-decoration: none;
      font-size: 16px;
      font-weight: 600;
      padding: 14px 32px;
      border-radius: 50px;
      transition: all 0.2s ease;
    }

    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    /* Footer */
    .footer {
      background-color: #f8fafc;
      padding: 24px 32px;
      font-size: 14px;
      color: #64748b;
      text-align: center;
    }

    .footer p {
      margin: 0 0 12px;
      font-size: 14px;
    }

    .footer a {
      color: #6366f1;
      text-decoration: none;
      margin: 0 8px;
    }

    .footer a:hover {
      text-decoration: underline;
    }

    .divider {
      display: inline-block;
      color: #cbd5e1;
      margin: 0 8px;
    }

    .copyright {
      margin-top: 20px;
      color: #94a3b8;
      font-size: 12px;
    }

    /* Responsive */
    @media (max-width: 600px) {
      .container {
        padding: 20px;
      }
      
      .content {
        padding: 30px 24px;
      }
      
      .verification-code {
        font-size: 32px;
        letter-spacing: 6px;
      }
      
      .button {
        padding: 12px 28px;
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <!-- Header -->
      <div class="header">
        <img src="/api/placeholder/180/50" alt="Company Logo" class="logo">
      </div>
      
      <!-- Content -->
      <div class="content">
        <h1>Verify your identity</h1>
        <p>Hello there,</p>
        <p>To complete your verification, please use the following code:</p>
        
        <!-- Code Box -->
        <div class="code-box">
          <div class="verification-code">${code}</div>
        </div>
        
        <p>This verification code will expire in <strong>10 minutes</strong>.</p>
        <p>If you didn't request this code, please ignore this email or contact our support team.</p>
        
        <p>Thank you,<br>The Security Team</p>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <p>This is an automated message, please do not reply.</p>
        <p>
          <a href="#">Terms of Service</a>
          <span class="divider">•</span>
          <a href="#">Privacy Policy</a>
          <span class="divider">•</span>
          <a href="#">Contact Support</a>
        </p>
        <p class="copyright">© 2025 Company Name. All rights reserved.</p>
      </div>
    </div>
    
    <!-- Mobile Notice -->
    <div style="text-align: center; padding-top: 20px; color: #94a3b8; font-size: 13px;">
      <p>If the button doesn't work, use this code: <strong>123456</strong></p>
    </div>
  </div>
</body>
</html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default sendEmail;