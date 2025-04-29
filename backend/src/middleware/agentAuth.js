const Server = require('../models/Server');

const agentAuth = async (req, res, next) => {
  try {
    // Obtener el token del header
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. No se proporcionó API key.' });
    }
    
    // Verificar que el servidor existe con ese API key
    const server = await Server.findOne({ apiKey: token });
    if (!server) {
      return res.status(401).json({ message: 'API key inválida.' });
    }
    
    // Añadir el servidor al request
    req.server = server;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error en autenticación del agente' });
  }
};

module.exports = agentAuth;