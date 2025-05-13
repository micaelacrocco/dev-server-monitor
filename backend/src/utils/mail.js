const nodemailer = require('nodemailer');

/**
 * Email transporter configuration using Nodemailer.
 * Uses Gmail as the service and authenticates with environment variables for security.
 */
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS   
  }
});

module.exports = transporter;