const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Inicializar la aplicación
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const serverRoutes = require('./routes/serverRoutes');
const metricRoutes = require('./routes/metricRoutes');
const alertRoutes = require('./routes/alertRoutes');

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/metrics', metricRoutes);
app.use('/api/alerts', alertRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de DevMonitor funcionando');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
