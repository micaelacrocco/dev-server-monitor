const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
  timestamp: { type: Date, default: Date.now },
  cpu: { type: Number },
  ram: {
    used: { type: Number },
    total: { type: Number }
  },
  disk: {
    used: { type: Number },
    total: { type: Number }
  },
  uptime: { type: Number }
});

// Índice para consultas rápidas por servidor y fecha
metricSchema.index({ serverId: 1, timestamp: -1 });

module.exports = mongoose.model('Metric', metricSchema);
