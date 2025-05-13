import React, { useState, useEffect } from "react";
import AlertsTable from "../components/AlertsTable";
import ServersTable from "../components/ServersTable";
import Anchor from "../components/Anchor";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function Dashboard() {
  const username = localStorage.getItem("name") || "User";
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const [metrics, setMetrics] = useState({
    systemStatus: 'Online',
    activeServers: 0,
    criticalAlerts: 0,
    cpuUsage: [],
    ramUsage: [],
    networkTraffic: [],
    latencyAverage: [],
  });

  // Función para formatear la fecha
  const formatLastUpdate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Simula la carga inicial de datos y actualización periódica
  useEffect(() => {
    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, 60000); // cada 1 minuto
    return () => clearInterval(intervalId);
  }, []);
  
  const fetchMetrics = async () => {
    try {
      // Aquí deberías hacer fetch a tu API real
      // const response = await fetch('/api/metrics');
      // const data = await response.json();
      const data = {
        systemStatus: 'Online',
        activeServers: 8,
        criticalAlerts: 3,
        cpuUsage: [45, 50, 55, 60, 52, 48],
        ramUsage: [65, 63, 60, 70, 68, 66],
        networkTraffic: [120, 130, 125, 140, 135, 128],
        latencyAverage: [20, 22, 21, 23, 19, 20],
      };
      setMetrics(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  const whiteBoxStyle = {
    backgroundColor: '#ffffff',
    flex: 1,
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const h3Style = {
    color:'#2b2a49',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px'
  };

  const average = (arr) => {
    if (!arr.length) return 0;
    return (arr.reduce((acc, val) => acc + val, 0) / arr.length).toFixed(1);
  };

  const smallGraph = (data, color) => (
    <Line
      data={{
        labels: data.map((_, i) => i + 1),
        datasets: [{
          label: '',
          data: data,
          borderColor: color,
          backgroundColor: 'transparent',
          pointRadius: 0,
          tension: 0.4,
        }]
      }}
      options={{
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } },
        elements: { line: { borderWidth: 2 } },
        responsive: true,
        maintainAspectRatio: false,
      }}
    />
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      fontFamily: 'sans-serif',
      background: '#f7f7f5',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
        <h2 style={{ fontSize: '28px', color: '#2b2a49', fontWeight: 'bold' }}>
          Hi, {username}! 👋
        </h2>
        <h4 style={{ alignSelf: 'end', fontSize: '12px', color: '#2b2a49' }}>
          Última actualización: {formatLastUpdate(lastUpdate)}
        </h4>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexGrow: 1 }}>
        <div style={{
          backgroundColor: '#f7f7f5',
          height: '150px',
          width: '100%',
          borderRadius: '10px',
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={whiteBoxStyle}>
            <h3 style={h3Style}>System Status</h3>
            <p style={{ fontSize: '20px', color: metrics.systemStatus === 'Online' ? 'green' : 'red' }}>
              {metrics.systemStatus}
            </p>
          </div>
          <div style={whiteBoxStyle}>
            <h3 style={h3Style}>Active Servers</h3>
            <p style={{ fontSize: '20px' }}>{metrics.activeServers}</p>
          </div>
          <div style={whiteBoxStyle}>
            <h3 style={h3Style}>Critical Alerts</h3>
            <p style={{ fontSize: '20px', color: 'red' }}>{metrics.criticalAlerts}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexGrow: 1 }}>
          <div style={{
            backgroundColor: '#f7f7f5',
            flex: 1,
            borderRadius: '10px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            paddingRight: '10px'
          }}>
            <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
              <div style={whiteBoxStyle}>
                <h3 style={h3Style}>CPU Usage (%)</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{average(metrics.cpuUsage)}%</p>
                <div style={{ height: '50px' }}>
                  {smallGraph(metrics.cpuUsage, 'blue')}
                </div>
              </div>
              <div style={whiteBoxStyle}>
                <h3 style={h3Style}>RAM Usage (%)</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{average(metrics.ramUsage)}%</p>
                <div style={{ height: '50px' }}>
                  {smallGraph(metrics.ramUsage, 'purple')}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
              <div style={whiteBoxStyle}>
                <h3 style={h3Style}>Network Traffic (MB)</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{average(metrics.networkTraffic)} MB</p>
                <div style={{ height: '50px' }}>
                  {smallGraph(metrics.networkTraffic, 'orange')}
                </div>
              </div>
              <div style={whiteBoxStyle}>
                <h3 style={h3Style}>Average Latency (ms)</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{average(metrics.latencyAverage)} ms</p>
                <div style={{ height: '50px' }}>
                  {smallGraph(metrics.latencyAverage, 'red')}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#f7f7f5',
            flex: 1,
            borderRadius: '10px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            paddingLeft: '10px'
          }}>
            <div style={whiteBoxStyle}>
              <h3 style={h3Style}>Server List</h3>
              <ServersTable />
            </div>
            <div style={whiteBoxStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={h3Style}>Latest Alerts & Events</h3>
                <Anchor href="/alerts" style={{ color: '#6a6a6a', fontSize: '14px' }}>View All</Anchor>
              </div>
              <AlertsTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
