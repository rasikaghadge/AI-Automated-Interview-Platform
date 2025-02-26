import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '0 16px',
    },
    content: {
      textAlign: 'center',
      maxWidth: '28rem',
    },
    title: {
      fontSize: '4rem',
      fontWeight: 700,
      color: '#1f2937',
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#4b5563',
      marginBottom: '1rem',
    },
    message: {
      color: '#6b7280',
      marginBottom: '2rem',
    },
    button: {
      display: 'inline-block',
      padding: '0.5rem 1rem',
      backgroundColor: '#2563eb',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '0.25rem',
      fontWeight: 500,
      cursor: 'pointer',
      border: 'none',
    },
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>404</h1>
        <h2 style={styles.subtitle}>Page Not Found</h2>
        <p style={styles.message}>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <button style={styles.button} onClick={handleClick}>
          Return to Homepage
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
