const Alert = require('../models/Alert');
const Server = require('../models/Server');

// Crear nueva alerta
exports.createAlert = async (req, res) => {
  try {
    const { serverId, type, metric, value, threshold, severity } = req.body;
    
    // Verificar si el servidor existe
    const serverExists = await Server.findById(serverId);
    if (!serverExists) {
      return res.status(404).json({ message: 'Servidor no encontrado' });
    }
    
    // Crear nueva alerta
    const alert = new Alert({
      serverId,
      type,
      metric,
      value,
      threshold,
      severity
    });
    
    await alert.save();
    
    res.status(201).json({
      message: 'Alerta creada exitosamente',
      alert
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear alerta', error: error.message });
  }
};

// Obtener todas las alertas
exports.getAllAlerts = async (req, res) => {
  try {
    const { serverId, resolved, severity, type, startDate, endDate, limit = 50, skip = 0 } = req.query;
    
    const query = {};
    
    // Filtros opcionales
    if (serverId) query.serverId = serverId;
    if (resolved !== undefined) query.resolved = resolved === 'true';
    if (severity) query.severity = severity;
    if (type) query.type = type;
    
    // Filtro por rango de fechas
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    const alerts = await Alert.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('serverId', 'name hostname');
    
    const total = await Alert.countDocuments(query);
    
    res.json({
      total,
      count: alerts.length,
      alerts
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener alertas', error: error.message });
  }
};

// Obtener una alerta por ID
exports.getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id).populate('serverId', 'name hostname');
    
    if (!alert) {
      return res.status(404).json({ message: 'Alerta no encontrada' });
    }
    
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener alerta', error: error.message });
  }
};

// Marcar alerta como resuelta
exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alerta no encontrada' });
    }
    
    if (alert.resolved) {
      return res.status(400).json({ message: 'La alerta ya está resuelta' });
    }
    
    alert.resolved = true;
    alert.resolvedAt = new Date();
    
    await alert.save();
    
    res.json({
      message: 'Alerta marcada como resuelta',
      alert
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al resolver alerta', error: error.message });
  }
};

// Obtener resumen de alertas por servidor
exports.getAlertsSummary = async (req, res) => {
  try {
    const summary = await Alert.aggregate([
      {
        $match: { resolved: false }
      },
      {
        $group: {
          _id: {
            serverId: '$serverId',
            severity: '$severity'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.serverId',
          alerts: {
            $push: {
              severity: '$_id.severity',
              count: '$count'
            }
          },
          totalAlerts: { $sum: '$count' }
        }
      },
      {
        $lookup: {
          from: 'servers',
          localField: '_id',
          foreignField: '_id',
          as: 'server'
        }
      },
      {
        $unwind: '$server'
      },
      {
        $project: {
          _id: 1,
          serverName: '$server.name',
          serverHostname: '$server.hostname',
          alerts: 1,
          totalAlerts: 1
        }
      }
    ]);
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener resumen de alertas', error: error.message });
  }
};

// Eliminar una alerta
exports.deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alerta no encontrada' });
    }
    
    res.json({ message: 'Alerta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar alerta', error: error.message });
  }
};