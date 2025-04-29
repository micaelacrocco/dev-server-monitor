const express = require('express');
const router = express.Router();
const metricController = require('../controllers/metricController');
const auth = require('../middleware/auth');
const agentAuth = require('../middleware/agentAuth');

// Ruta para registrar nuevas métricas (protegida por API key de agente)
router.post('/', agentAuth, metricController.recordMetric);

// Rutas protegidas por autenticación regular
router.use(auth);

// Obtener métricas por servidor
router.get('/server/:serverId', metricController.getServerMetrics);

// Obtener la métrica más reciente para un servidor
router.get('/server/:serverId/latest', metricController.getLatestMetric);

// Eliminar métricas antiguas (limpieza)
router.delete('/cleanup', metricController.cleanupMetrics);

// Obtener promedios de todas las métricas de servidores activos
router.get('/averages', metricController.getAverages);

module.exports = router;
