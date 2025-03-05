import React from 'react';
import { MicIcon, VideoIcon } from './IconComponents.jsx';
import Avatar from './Avatar.jsx';

const VideoSection = ({ 
  videoRef, 
  isVideoOff, 
  setIsVideoOff, 
  isMuted, 
  setIsMuted,
}) => {
  const iconButtonStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    margin: '10px 0',
  };

  return (
    <div style={cardStyle}>
      <div
        style={{
          aspectRatio: '16/9',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isVideoOff ? (
          <div style={{ color: 'white', textAlign: 'center' }}>
            <VideoIcon off={true} />
            <p style={{ marginTop: '10px' }}>Camera is off</p>
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#2a2a2a',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <Avatar />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            // if (isMuted) simulateSpeechInput();
          }}
          style={{
            ...iconButtonStyle,
            backgroundColor: isMuted ? '#dc3545' : '#6c757d',
            color: 'white',
          }}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          <MicIcon muted={isMuted} />
        </button>
        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          style={{
            ...iconButtonStyle,
            backgroundColor: isVideoOff ? '#dc3545' : '#6c757d',
            color: 'white',
          }}
          title={isVideoOff ? 'Start Video' : 'Stop Video'}
        >
          <VideoIcon off={isVideoOff} />
        </button>
      </div>
        <button>Start speaking</button> ? <button>Submit Answer</button>
    </div>
  );
};

export default VideoSection;