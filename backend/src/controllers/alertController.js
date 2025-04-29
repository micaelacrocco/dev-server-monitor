const Alert = require('../models/Alert');
const Server = require('../models/Server');

exports.createAlert = async (req, res) => {
  try {
    const { serverId, type, metric, value, threshold, severity } = req.body;
    
    const serverExists = await Server.findById(serverId);
    if (!serverExists) {
      return res.status(404).json({ message: 'Server not found' });
    }
    
    const alert = new Alert({ serverId, type, metric, value, threshold, severity });
    
    await alert.save();
    
    res.status(201).json({
      message: 'Alert successfully created',
      alert
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating alert', error: error.message });
  }
};

exports.getAllAlerts = async (req, res) => {
  try {
    const { serverId, resolved, severity, type, startDate, endDate, limit = 50, skip = 0 } = req.query;
    
    const query = {};
    
    if (serverId) query.serverId = serverId;
    if (resolved !== undefined) query.resolved = resolved === 'true';
    if (severity) query.severity = severity;
    if (type) query.type = type;
    
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
    res.status(500).json({ message: 'Error retrieving alerts', error: error.message });
  }
};

exports.getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id).populate('serverId', 'name hostname');
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving alert', error: error.message });
  }
};

exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    if (alert.resolved) {
      return res.status(400).json({ message: 'Alert is already resolved' });
    }
    
    alert.resolved = true;
    alert.resolvedAt = new Date();
    
    await alert.save();
    
    res.json({
      message: 'Alert marked as resolved',
      alert
    });
  } catch (error) {
    res.status(500).json({ message: 'Error resolving alert', error: error.message });
  }
};

exports.getAlertsSummary = async (req, res) => {
  try {
    const summary = await Alert.aggregate([
      { $match: { resolved: false } },
      { $group: { _id: { serverId: '$serverId', severity: '$severity' }, count: { $sum: 1 } } },
      { $group: { _id: '$_id.serverId', alerts: { $push: { severity: '$_id.severity', count: '$count' } }, totalAlerts: { $sum: '$count' } } },
      { $lookup: { from: 'servers', localField: '_id', foreignField: '_id', as: 'server' } },
      { $unwind: '$server' },
      { $project: { _id: 1, serverName: '$server.name', serverHostname: '$server.hostname', alerts: 1, totalAlerts: 1 } }
    ]);
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving alert summary', error: error.message });
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    res.json({ message: 'Alert successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting alert', error: error.message });
  }
};
