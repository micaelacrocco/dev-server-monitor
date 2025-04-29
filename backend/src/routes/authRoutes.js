const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas protegidas
router.get('/profile', auth, authController.getProfile);
router.put('/preferences', auth, authController.updatePreferences);

module.exports = router;