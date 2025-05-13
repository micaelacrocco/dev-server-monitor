import React, { useState, useEffect } from 'react';
import axios from 'axios'; // ✅ Importar axios
import { Button, Input } from '../components';
import ServersTableWInput from '../components/ServersTableWInput';
import ServerForm from '../components/ServerForm';

function Settings() {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función para cargar la lista de servidores
    const loadServers = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No se encontró token de autenticación');
            }

            const response = await axios.get('http://localhost:5000/api/servers', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setServers(response.data.servers);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServers();
    }, []);

    const handleServerAdded = (newServer) => {
        loadServers();
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            fontFamily: 'sans-serif',
            background: '#f7f7f5',
            paddingTop: '20px',
            paddingBottom: '20px',
            paddingRight: '20px',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
                <h2 style={{ fontSize: '28px', color: '#2b2a49', fontWeight: 'bold' }}>
                    Settings
                </h2>
            </div>

            <div style={{ width: '100%', height: '100%' }}>
                <h3 style={{ fontSize: 16, color: '#2b2a49', fontWeight: 'bold', marginBottom: '15px' }}>Add Server</h3>
                <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '12px', marginBottom: '5px' }}>
                    <ServerForm onServerAdded={handleServerAdded} />
                </div>
                <h3 style={{ fontSize: 16, color: '#2b2a49', fontWeight: 'bold', marginBottom: '15px' }}>Search Server</h3>
                <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '12px', marginBottom: '5px' }}>
                    <ServersTableWInput servers={servers} onRefresh={loadServers} />
                </div>
            </div>
        </div>
    );
}

export default Settings;
