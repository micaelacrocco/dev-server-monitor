const Server = require('../models/Server');
const Metric = require('../models/Metric');
const Alert = require('../models/Alert');
const crypto = require('crypto');

exports.createServer = async (req, res) => {
  try {
    const { name, ip, os, thresholds } = req.body;
    
    const apiKey = crypto.randomBytes(32).toString('hex');
    
    const server = new Server({
      name,
      ip,
      apiKey,
      os,
      thresholds: {
        ...thresholds
      }
    });
    
    await server.save();
    
    res.status(201).json({
      message: 'Servidor creado exitosamente',
      server: {
        id: server._id,
        name: server.name,
        ip: server.ip,
        apiKey: server.apiKey,
        os: server.os,
        status: server.status,
        thresholds: server.thresholds
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear servidor', error: error.message });
  }
};

exports.getAllServers = async (req, res) => {
  try {
    const { status, isActive } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const servers = await Server.find(query).select('-apiKey');
    
    res.json({
      count: servers.length,
      servers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener servidores', error: error.message });
  }
};

exports.getServerById = async (req, res) => {
  try {
    const server = await Server.findById(req.params.id).select('-apiKey');
    
    if (!server) {
      return res.status(404).json({ message: 'Servidor no encontrado' });
    }

    const latestMetric = await Metric.findOne({ serverId: server._id })
      .sort({ timestamp: -1 })
      .limit(1);
    
    const activeAlerts = await Alert.find({
      serverId: server._id,
      resolved: false
    }).sort({ timestamp: -1 });
    
    res.json({
      server,
      latestMetric,
      activeAlerts: {
        count: activeAlerts.length,
        items: activeAlerts
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener servidor', error: error.message });
  }
};

exports.updateServer = async (req, res) => {
  try {
    const { name, ip, os, thresholds, isActive } = req.body;
    
    const server = await Server.findById(req.params.id);
    
    if (!server) {
      return res.status(404).json({ message: 'Servidor no encontrado' });
    }
    
    if (name) server.name = name;
    if (ip) server.ip = ip;
    if (os) server.os = os;
    if (isActive !== undefined) server.isActive = isActive;
    
    if (thresholds) {
      if (thresholds.cpu !== undefined) server.thresholds.cpu = thresholds.cpu;
      if (thresholds.ram !== undefined) server.thresholds.ram = thresholds.ram;
      if (thresholds.disk !== undefined) server.thresholds.disk = thresholds.disk;
    }
    
    await server.save();
    
    res.json({
      message: 'Servidor actualizado exitosamente',
      server: {
        id: server._id,
        name: server.name,
        ip: server.ip,
        os: server.os,
        status: server.status,
        thresholds: server.thresholds,
        isActive: server.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar servidor', error: error.message });
  }
};

exports.regenerateApiKey = async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);
    
    if (!server) {
      return res.status(404).json({ message: 'Servidor no encontrado' });
    }
    
    server.apiKey = crypto.randomBytes(32).toString('hex');
    
    await server.save();
    
    res.json({
      message: 'API key regenerada exitosamente',
      apiKey: server.apiKey
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al regenerar API key', error: error.message });
  }
};

exports.deleteServer = async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);
    
    if (!server) {
      return res.status(404).json({ message: 'Servidor no encontrado' });
    }

    await Metric.deleteMany({ serverId: server._id });
    await Alert.deleteMany({ serverId: server._id });
    
    await Server.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Servidor y todos sus datos relacionados eliminados correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar servidor', error: error.message });
  }
};

exports.checkServersStatus = async (req, res) => {
  try {
    const timeThreshold = new Date();
    timeThreshold.setMinutes(timeThreshold.getMinutes() - 5); 
    
    const inactiveServers = await Server.find({
      isActive: true,
      status: { $ne: 'inactive' },
      lastUpdate: { $lt: timeThreshold }
    });
    
    const updatedServers = [];
    
    for (const server of inactiveServers) {
      const previousStatus = server.status;
      server.previousStatus = previousStatus;
      server.status = 'inactive';
      
      await server.save();
      updatedServers.push(server._id);

      const alert = new Alert({
        serverId: server._id,
        type: 'unavailable',
        metric: 'Server Availability',
        value: 'unavailable',
        severity: 'critical'
      });
      
      await alert.save();
    }
    
    res.json({
      message: `${updatedServers.length} servidores marcados como inactivos`,
      updatedServers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar estado de servidores', error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const serverCountsByStatus = await Server.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const activeAlertsByType = await Alert.aggregate([
      {
        $match: { resolved: false }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const activeAlertsBySeverity = await Alert.aggregate([
      {
        $match: { resolved: false }
      },
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      servers: {
        byStatus: serverCountsByStatus.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      },
      activeAlerts: {
        byType: activeAlertsByType.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        bySeverity: activeAlertsBySeverity.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};