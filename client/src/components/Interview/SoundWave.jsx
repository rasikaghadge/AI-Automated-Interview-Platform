import React from 'react';

const SoundWave = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    height: '15px',
  }}>
    {[1, 2, 3, 4].map(i => (
      <div 
        key={i}
        style={{
          width: '3px',
          height: `${Math.random() * 100}%`,
          backgroundColor: '#28a745',
          borderRadius: '2px',
          animation: `soundWave ${0.5 + Math.random() * 0.5}s infinite ease-in-out alternate`,
        }}
      />
    ))}
  </div>
);

export default SoundWave;