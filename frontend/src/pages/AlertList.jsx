import React, { useState } from 'react';
import AlertsTable from '../components/AlertsTable';
import { Button, GhostButton, Input } from '../components';
import Modal from '../components/Modal';

function AlertList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        serverId: '',
        type: '',
        severity: '',
        resolved: '',
        startDate: '',
        endDate: '',
    });

    // Manejo de cambios en los filtros
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Aplicar filtros
    const handleApplyFilters = async () => {
      try {
          // Crear los parámetros de búsqueda de la URL
          const queryParams = new URLSearchParams(filters).toString();
          const response = await fetch(`/api/alerts?${queryParams}`);
          const data = await response.json();
          console.log('Alertas filtradas:', data);
  
          // Cerrar el modal al aplicar los filtros
          setIsModalOpen(false);
      } catch (error) {
          console.error('Error filtrando alertas:', error);
      }
  };

    // Limpiar filtros
    const handleClearFilters = () => {
        setFilters({
            serverId: '',
            type: '',
            severity: '',
            resolved: '',
            startDate: '',
            endDate: '',
        });
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            fontFamily: 'sans-serif',
            background: '#f7f7f5',
            paddingTop: '20px',
            paddingBottom: '20px',
            paddingRight: '20px',
            paddingLeft: '20px',
        }}>
            {/* Título */}
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '28px', color: '#2b2a49', fontWeight: 'bold', margin: 0 }}>
                    List of Alerts
                </h2>
            </div>

            {/* Input + Botón */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
            }}>
                <Input 
                    style={{ 
                        flex: 1, 
                        backgroundColor: '#ffffff',
                        marginLeft: '0px',
                    }}
                    placeholder="Server Name"
                />
                <Button 
                    style={{ padding: '8px 16px' }}
                    onClick={() => setIsModalOpen(true)} // Abrir modal
                >
                    Filter
                </Button>
            </div>

            {/* Tabla de alertas */}
            <AlertsTable />

            {/* Modal para aplicar filtros */}
            {isModalOpen && (
                <Modal 
                    title="Filter Alerts"
                    onClose={() => setIsModalOpen(false)} // Cerrar modal
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {/* Tipo de Alerta */}
                        <select 
                            name="type"
                            value={filters.type}
                            onChange={handleChange}
                            style={{ padding: '8px', borderRadius: '8px' }}
                        >
                            <option value="">Select Alert Type</option>
                            <option value="cpu">CPU</option>
                            <option value="ram">RAM</option>
                            <option value="disk">Disk</option>
                            <option value="status_change">Status Change</option>
                            <option value="unavailable">Unavailable</option>
                        </select>

                        {/* Severidad */}
                        <select 
                            name="severity"
                            value={filters.severity}
                            onChange={handleChange}
                            style={{ padding: '8px', borderRadius: '8px' }}
                        >
                            <option value="">Select Severity</option>
                            <option value="warning">Warning</option>
                            <option value="critical">Critical</option>
                        </select>

                        {/* Estado */}
                        <select 
                            name="resolved"
                            value={filters.resolved}
                            onChange={handleChange}
                            style={{ padding: '8px', borderRadius: '8px' }}
                        >
                            <option value="">Select Status</option>
                            <option value="true">Resolved</option>
                            <option value="false">Unresolved</option>
                        </select>

                        {/* Rango de Fechas */}
                        <div>
                            <span style={{ fontSize: '14px', color: '#333' }}>
                                Filter by Date Range
                            </span>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <Input 
                                    type="date"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={handleChange}
                                    style={{ backgroundColor: '#ffffff', margin: '0px' }}
                                />
                                <Input 
                                    type="date"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={handleChange}
                                    style={{ backgroundColor: '#ffffff', margin: '0px' }}
                                />
                            </div>
                        </div>

                        {/* Botón para aplicar filtros */}
                        <Button 
                            onClick={handleApplyFilters}
                            style={{ padding: '10px', marginTop: '5px' }}
                        >
                            Apply Filters
                        </Button>

                        {/* Botón para limpiar filtros */}
                        <GhostButton 
                            onClick={handleClearFilters}
                            style={{ padding: '10px', marginTop: '5px' }}
                        >
                            Clear Filters
                        </GhostButton>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default AlertList;
