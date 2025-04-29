const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const auth = require('../middleware/auth');

// Todas las rutas de alertas están protegidas por autenticación
router.use(auth);

// Crear una nueva alerta
router.post('/', alertController.createAlert);

// Obtener todas las alertas (con filtros opcionales)
router.get('/', alertController.getAllAlerts);

// Obtener resumen de alertas por servidor
router.get('/summary', alertController.getAlertsSummary);

// Obtener una alerta específica
router.get('/:id', alertController.getAlertById);

// Marcar una alerta como resuelta
router.put('/:id/resolve', alertController.resolveAlert);

// Eliminar una alerta
router.delete('/:id', alertController.deleteAlert);

module.exports = router;