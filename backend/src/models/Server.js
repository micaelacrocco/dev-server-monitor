const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  ip: { type: String, required: true }, 
  apiKey: { type: String, required: true }, 
  os: { type: String }, 
  status: { 
    type: String, 
    default: 'inactive', 
    enum: ['ok', 'warning', 'critical', 'inactive']
  }, 
  previousStatus: { type: String },
  thresholds: {
    cpu: { type: Number, default: 80 }, 
    ram: { type: Number, default: 70 }, 
    disk: { type: Number, default: 90 } 
  },
  lastUpdate: { type: Date }, 
  isActive: { type: Boolean, default: true } 
}, { timestamps: true }); 

module.exports = mongoose.model('Server', serverSchema);