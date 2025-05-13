import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from './Input';
import Modal from '../components/Modal';

const ServersTableWInput = () => {
  const [servers, setServers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [newServerIP, setNewServerIP] = useState('');
  const [selectedServer, setSelectedServer] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/servers`, {
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchServers();
    } catch (error) {
      console.error('Error deleting server:', error);
      alert('No se pudo eliminar el servidor.');
    }
  };

  const handleAddServer = async () => {
    if (!newServerName || !newServerIP) {
      alert('Por favor, completá ambos campos.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/servers`, {
        name: newServerName,
        ip: newServerIP,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewServerName('');
      setNewServerIP('');
      setShowModal(false);
      fetchServers();
    } catch (error) {
      console.error('Error adding server:', error);
      alert('No se pudo agregar el servidor.');
    }
  };

  const filteredServers = servers.filter((server) =>
    server.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '0px', fontSize: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <Input 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar servidor por nombre..."
        />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px', color: '#2b2a49', textAlign: 'left' }}>Name</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px', color: '#2b2a49', textAlign: 'center' }}>IP Address</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px', color: '#2b2a49', textAlign: 'right' }}></th>
          </tr>
        </thead>
        <tbody>
          {filteredServers.length > 0 ? (
            filteredServers.map((server) => (
              <tr key={server._id}>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'left' }}>{server.name}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'center' }}>{server.ip}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right' }}>
                  <button
                    onClick={() => {
                      setSelectedServer(server);
                      setIsDetailsModalOpen(true);
                    }}
                    style={{
                      color: '#c2a4f9',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '8px',
                    }}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleDelete(server._id)}
                    style={{
                      color: '#ff3131',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: '8px' }}>
                No se encontraron servidores.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isDetailsModalOpen && selectedServer && (
        <Modal onClose={() => setIsDetailsModalOpen(false)}>
          <h2>Detalles del Servidor</h2>
          <p><strong>Nombre:</strong> {selectedServer.name}</p>
          <p><strong>IP:</strong> {selectedServer.ip}</p>

          <button 
            onClick={() => setIsDetailsModalOpen(false)} 
            style={{ marginTop: '16px', padding: '6px 12px', borderRadius: '4px', background: '#ccc' }}
          >
            Cerrar
          </button>
        </Modal>
      )}
    </div>
  );
};

export default ServersTableWInput;
