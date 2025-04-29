const nodemailer = require('nodemailer');

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes cambiarlo por otro servicio si lo necesitas
  auth: {
    user: process.env.EMAIL_USER,  // Tu correo electrónico
    pass: process.env.EMAIL_PASS   // Tu contraseña (o una contraseña de aplicación si usas Gmail con 2FA)
  }
});

module.exports = transporter;