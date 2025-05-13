import React from 'react';

const Modal = ({ title, children, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(43, 42, 73, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        position: 'relative',
        backgroundColor: '#f7f7f5',
        padding: '20px',
        borderRadius: '12px',
        width: '400px',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#6a6a6a',
            marginRight: '10px',
          }}
        >
          ×
        </button>
        <h2 style={{ marginBottom: '15px', color: '#2b2a49', fontSize: '25px', fontWeight: 'bold' }}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;
