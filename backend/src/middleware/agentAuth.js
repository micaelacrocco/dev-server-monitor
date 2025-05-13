const Server = require('../models/Server');

const agentAuth = async (req, res, next) => {
  try {

    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No API key provided.' });
    }

    const server = await Server.findOne({ apiKey: token });
    if (!server) {
      return res.status(401).json({ message: 'Invalid API key.' });
    }
    
    req.server = server;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Agent authentication error' });
  }
};

module.exports = agentAuth;