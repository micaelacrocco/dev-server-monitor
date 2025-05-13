import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ServersTable = () => {
  const [servers, setServers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/servers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data.servers)) {
        setServers(response.data.servers);
      } else {
        setServers([]);
      }
    } catch (error) {
      console.error('Error fetching servers:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro que querés eliminar este servidor?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/servers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchServers();
    } catch (error) {
      console.error('Error deleting server:', error);
      alert('No se pudo eliminar el servidor.');
    }
  };

  return (
    <div style={{ padding: '0px', fontSize: '16px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px', borderBottom: '2px solid #ccc', textAlign: 'left', color: '#6a6a6a', fontSize: '12px' }}>Name</th>
            <th style={{ padding: '8px', borderBottom: '2px solid #ccc', textAlign: 'center', color: '#6a6a6a', fontSize: '12px' }}>IP Address</th>
            <th style={{ padding: '8px', borderBottom: '2px solid #ccc', textAlign: 'right', color: '#6a6a6a', fontSize: '12px' }}></th>
          </tr>
        </thead>
        <tbody>
          {servers.length > 0 ? (
            servers.map((server) => (
              <tr key={server._id}>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'left' }}>{server.name}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'center' }}>{server.ip}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDelete(server._id)}
                    style={{
                      color: 'red',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: '8px', paddingTop: '40px', color: '#6a6a6a' }}>
                No servers have been registered.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServersTable;
