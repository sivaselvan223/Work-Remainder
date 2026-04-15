const nodemailer = require('nodemailer');

let transporter = null;

// Initialize email transporter
const initEmailService = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log('📧 Email service: SMTP not configured (optional)');
    return;
  }

  try {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });
    console.log('📧 Email service initialized');
  } catch (error) {
    console.error('📧 Email service failed to initialize:', error.message);
  }
};

// Send reminder email
const sendReminderEmail = async (to, task) => {
  if (!transporter) return;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: `⏰ Reminder: ${task.title}`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 20px; border-radius: 12px 12px 0 0;">
            <h2 style="color: white; margin: 0;">⏰ Task Reminder</h2>
          </div>
          <div style="background: #1e293b; padding: 20px; border-radius: 0 0 12px 12px; color: #e2e8f0;">
            <h3 style="color: #a5b4fc;">${task.title}</h3>
            <p>${task.description || 'No description'}</p>
            <p style="color: #94a3b8; font-size: 0.875rem;">
              Scheduled: ${new Date(task.datetime).toLocaleString()}
            </p>
          </div>
        </div>
      `
    });
    console.log(`📧 Reminder email sent to ${to} for task: ${task.title}`);
  } catch (error) {
    console.error('📧 Failed to send email:', error.message);
  }
};

module.exports = { initEmailService, sendReminderEmail };
