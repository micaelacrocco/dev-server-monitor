import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input } from '../components';

const ServerForm = ({ onServerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    os: 'Linux',
    thresholds: {
      cpu: 80,
      ram: 70,
      disk: 90
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No se encontró token de autenticación');

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/servers`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSuccess(true);
      setFormData({
        name: '',
        ip: '',
        os: 'Linux',
        thresholds: { cpu: 80, ram: 70, disk: 90 }
      });

      if (onServerAdded) onServerAdded(response.data.server);

      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al conectar con el servidor o respuesta inválida');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f7f7f5', padding: '20px', borderRadius: '12px', margin: '8px' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Añadir nuevo servidor</h3>

      {error && (
        <div style={{ color: 'red', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ color: 'green', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
          Servidor añadido correctamente
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Nombre del servidor *
          </label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="ej. Servidor de Producción"
            required
            style={{ width: '100%', backgroundColor: '#ffffff' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Dirección IP / Host *
          </label>
          <Input
            type="text"
            name="ip"
            value={formData.ip}
            onChange={handleChange}
            placeholder="ej. 192.168.1.100 o servidor.ejemplo.com"
            required
            style={{ width: '100%', backgroundColor: '#ffffff' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Sistema Operativo
          </label>
          <select
            name="os"
            value={formData.os}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="Linux">Linux</option>
            <option value="Windows">Windows</option>
            <option value="MacOS">MacOS</option>
            <option value="Unix">Unix</option>
            <option value="Other">Otro</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
          {['cpu', 'ram', 'disk'].map((resource) => (
            <div style={{ flex: '1' }} key={resource}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Umbral {resource.toUpperCase()} (%)
              </label>
              <select
                name={`thresholds.${resource}`}
                value={formData.thresholds[resource]}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).map(value => (
                  <option key={value} value={value}>{value}%</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" disabled={loading} style={{ minWidth: '120px' }}>
            {loading ? 'Añadiendo...' : 'Añadir Servidor'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServerForm;
