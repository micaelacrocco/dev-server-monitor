const express = require('express');
const router = express.Router();
const serverController = require('../controllers/serverController');
const auth = require('../middleware/auth');

// Todas las rutas de servidores están protegidas por autenticación
router.use(auth);

// Crear un nuevo servidor
router.post('/', serverController.createServer);

// Obtener todos los servidores
router.get('/', serverController.getAllServers);

// Obtener estadísticas generales
router.get('/stats', serverController.getStats);

// Verificar estado de servidores
router.post('/check-status', serverController.checkServersStatus);

// Obtener un servidor específico
router.get('/:id', serverController.getServerById);

// Actualizar un servidor
router.put('/:id', serverController.updateServer);

// Regenerar API key
router.post('/:id/regenerate-key', serverController.regenerateApiKey);

// Eliminar un servidor
router.delete('/:id', serverController.deleteServer);

module.exports = router;