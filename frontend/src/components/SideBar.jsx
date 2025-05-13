import { IoStatsChart, IoLogOutOutline, IoSettingsOutline, IoRefreshOutline, IoDownloadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate(); 

  const handleDashboard = () => {
    navigate("/dashboard"); 
  }

  const handleDownload = () => {
    // Aquí puedes implementar la lógica para descargar el informe
    console.log("Descargando informe...");
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSettings = () => {
    navigate("/settings"); 
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/login');
  };
  

  return (
    <div style={styles.sidebar}>
        <div style={styles.topButtons}>
        <button style={{ ...styles.circleButton, backgroundColor: '#2b2a49' }} onClick={handleDashboard}>
            <IoStatsChart size={24} color="#ffffff" />
        </button>
        <button style={styles.circleButton} onClick={handleDownload}>
            <IoDownloadOutline size={24} color="#2b2a49" />
        </button>
        <button style={styles.circleButton} onClick={handleRefresh}>
            <IoRefreshOutline size={24} color="#2b2a49" />
        </button>
        </div>
        <button style={styles.circleButton} onClick={handleSettings}>
            <IoSettingsOutline size={24} color="#2b2a49"/>
        </button>
        <button style={{ ...styles.circleButton, marginTop: 'auto' }} onClick={handleLogout}>
            <IoLogOutOutline size={24} color="#2b2a49" />
        </button>
    </div>
  );
};

const styles = {
  sidebar: {
    height: '100vh',
    width: '100px',
    backgroundColor: '#f7f7f5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '25px',
    paddingBottom: '25px',
    gap: '20px',
  },
  circleButton: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#ffffff',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0, 
    backgroundColor: '#ffffff',
    borderRadius: '50px',
  },  
};

export default Sidebar;
