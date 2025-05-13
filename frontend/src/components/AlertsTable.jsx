import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AlertsTable = () => {
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/alerts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setAlerts(response.data);
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro que querés eliminar esta alerta?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/alerts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error deleting alert:', error);
      alert('No se pudo eliminar la alerta.');
    }
  };

  return (
    <div style={{ padding: '0px', fontSize: '16px' }}>
      {/* Tabla */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px', borderBottom: '2px solid #ccc', textAlign: 'left', color: '#6a6a6a', fontSize: '12px' }}>Server</th>
            <th style={{ padding: '8px', borderBottom: '2px solid #ccc', textAlign: 'left', color: '#6a6a6a', fontSize: '12px' }}>Type</th>
            <th style={{ padding: '8px', borderBottom: '2px solid #ccc', textAlign: 'center', color: '#6a6a6a', fontSize: '12px' }}>Severity</th>
            <th style={{ padding: '8px', borderBottom: '2px solid #ccc', textAlign: 'center', color: '#6a6a6a', fontSize: '12px' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <tr key={alert._id}>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  {alert.serverName || 'Servidor desconocido'}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{alert.type}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'center' }}>{alert.severity}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                  {new Date(alert.timestamp).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '8px', paddingTop: '40px', color: '#6a6a6a' }}>
                No alerts have been registered.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AlertsTable;
