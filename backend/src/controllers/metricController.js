const mongoose = require('mongoose');
const Metric = require('../models/Metric');
const Server = require('../models/Server');
const Alert = require('../models/Alert');

exports.recordMetric = async (req, res) => {
  try {
    const { serverId, cpu, ram, disk, uptime } = req.body;

    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ message: 'Servidor no encontrado' });
    }

    const metric = new Metric({ serverId, cpu, ram, disk, uptime });
    await metric.save();

    const previousStatus = server.status;
    let newStatus = 'ok';
    const alerts = [];

    if (cpu > server.thresholds.cpu) {
      const severity = cpu > server.thresholds.cpu * 1.2 ? 'critical' : 'warning';
      newStatus = severity === 'critical' ? 'critical' : (newStatus === 'ok' ? 'warning' : newStatus);

      const alert = new Alert({
        serverId,
        type: 'cpu',
        metric: 'CPU Usage',
        value: cpu,
        threshold: server.thresholds.cpu,
        severity
      });

      await alert.save();
      alerts.push(alert);
    }

    const ramUsage = (ram.used / ram.total) * 100;
    if (ramUsage > server.thresholds.ram) {
      const severity = ramUsage > server.thresholds.ram * 1.2 ? 'critical' : 'warning';
      newStatus = severity === 'critical' ? 'critical' : (newStatus === 'ok' ? 'warning' : newStatus);

      const alert = new Alert({
        serverId,
        type: 'ram',
        metric: 'RAM Usage',
        value: ramUsage,
        threshold: server.thresholds.ram,
        severity
      });

      await alert.save();
      alerts.push(alert);
    }

    const diskUsage = (disk.used / disk.total) * 100;
    if (diskUsage > server.thresholds.disk) {
      const severity = diskUsage > server.thresholds.disk * 1.2 ? 'critical' : 'warning';
      newStatus = severity === 'critical' ? 'critical' : (newStatus === 'ok' ? 'warning' : newStatus);

      const alert = new Alert({
        serverId,
        type: 'disk',
        metric: 'Disk Usage',
        value: diskUsage,
        threshold: server.thresholds.disk,
        severity
      });

      await alert.save();
      alerts.push(alert);
    }

    if (previousStatus !== newStatus && previousStatus !== 'inactive') {
      const alert = new Alert({
        serverId,
        type: 'status_change',
        metric: 'Status Change',
        value: { from: previousStatus, to: newStatus },
        severity: newStatus === 'critical' ? 'critical' : 'warning'
      });

      await alert.save();
      alerts.push(alert);
    }

    server.status = newStatus;
    server.lastUpdate = new Date();
    await server.save();

    res.status(201).json({
      message: 'Métrica registrada exitosamente',
      metric,
      serverStatus: server.status,
      alerts: alerts.length > 0 ? alerts : undefined
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar métrica', error: error.message });
  }
};

exports.getServerMetrics = async (req, res) => {
  try {
    const { serverId } = req.params;
    const { hours = 24, interval = 'hour' } = req.query;

    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ message: 'Servidor no encontrado' });
    }

    const since = new Date();
    since.setHours(since.getHours() - parseInt(hours));

    let metrics;

    if (interval === 'raw') {
      metrics = await Metric.find({
        serverId,
        timestamp: { $gte: since }
      }).sort({ timestamp: 1 });

      return res.json({
        server: { id: server._id, name: server.name, status: server.status },
        metrics
      });
    }

    const groupBy = interval === 'hour'
      ? { year: { $year: "$timestamp" }, month: { $month: "$timestamp" }, day: { $dayOfMonth: "$timestamp" }, hour: { $hour: "$timestamp" } }
      : { year: { $year: "$timestamp" }, month: { $month: "$timestamp" }, day: { $dayOfMonth: "$timestamp" } };

    metrics = await Metric.aggregate([
      { $match: { serverId: mongoose.Types.ObjectId(serverId), timestamp: { $gte: since } } },
      { $group: {
          _id: groupBy,
          timestamp: { $first: "$timestamp" },
          avgCpu: { $avg: "$cpu" },
          maxCpu: { $max: "$cpu" },
          avgRamUsed: { $avg: "$ram.used" },
          avgRamTotal: { $avg: "$ram.total" },
          avgDiskUsed: { $avg: "$disk.used" },
          avgDiskTotal: { $avg: "$disk.total" },
          avgUptime: { $avg: "$uptime" },
          count: { $sum: 1 }
        }
      },
      { $sort: { timestamp: 1 } }
    ]);

    res.json({
      server: { id: server._id, name: server.name, status: server.status },
      interval,
      metrics
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener métricas', error: error.message });
  }
};

exports.getLatestMetric = async (req, res) => {
  try {
    const { serverId } = req.params;

    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ message: 'Servidor no encontrado' });
    }

    const metric = await Metric.findOne({ serverId })
      .sort({ timestamp: -1 })
      .limit(1);

    if (!metric) {
      return res.status(404).json({ message: 'No se encontraron métricas para este servidor' });
    }

    res.json({
      server: { id: server._id, name: server.name, status: server.status },
      metric
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener métrica reciente', error: error.message });
  }
};

exports.cleanupMetrics = async (req, res) => {
  try {
    const { days = 30 } = req.body;

    const olderThan = new Date();
    olderThan.setDate(olderThan.getDate() - parseInt(days));

    const result = await Metric.deleteMany({
      timestamp: { $lt: olderThan }
    });

    res.json({
      message: `Se eliminaron ${result.deletedCount} métricas antiguas`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al limpiar métricas antiguas', error: error.message });
  }
};

exports.getAverages = async (req, res) => {
  try {

    const activeServers = await Server.find({ status: { $ne: 'inactive' } }).select('_id');

    if (activeServers.length === 0) {
      return res.status(404).json({ message: 'No hay servidores activos' });
    }

    const activeServerIds = activeServers.map(server => server._id);

    const averages = await Metric.aggregate([
      {
        $match: {
          serverId: { $in: activeServerIds }
        }
      },
      {
        $group: {
          _id: null,
          avgCpu: { $avg: "$cpu" },
          avgRamUsed: { $avg: "$ram.used" },
          avgRamTotal: { $avg: "$ram.total" },
          avgDiskUsed: { $avg: "$disk.used" },
          avgDiskTotal: { $avg: "$disk.total" },
          avgUptime: { $avg: "$uptime" }
        }
      }
    ]);

    if (averages.length === 0) {
      return res.status(404).json({ message: 'No hay métricas registradas' });
    }

    res.json({
      averages: averages[0]
    });

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener promedios de métricas', error: error.message });
  }
};

