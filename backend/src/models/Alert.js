const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, required: true, enum: ['cpu', 'ram', 'disk', 'status_change', 'unavailable'] },
  metric: { type: String },
  value: { type: mongoose.Schema.Types.Mixed },
  threshold: { type: Number },
  severity: { type: String, required: true, enum: ['warning', 'critical'] },
  resolved: { type: Boolean, default: false },
  resolvedAt: { type: Date }
});

alertSchema.index({ serverId: 1, timestamp: -1, resolved: 1 });

module.exports = mongoose.model('Alert', alertSchema);