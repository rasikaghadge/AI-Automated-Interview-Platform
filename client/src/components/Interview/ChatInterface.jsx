import React from 'react';
import { MicIcon } from './IconComponents';
import SoundWave from './SoundWave';

const ChatInterface = ({
  chatContainerRef,
  chatMessages,
  interviewer,
  isInterviewInProgress,
  isAiSpeaking,
  questionTimeLeft,
  formatTime,
  transcribedUserResponse,
  isMuted
}) => {
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    margin: '10px 0',
  };

  // Timer component
  const TimerDisplay = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '15px',
      }}
    >
      <div
        style={{
          padding: '8px 12px',
          borderRadius: '5px',
          backgroundColor: questionTimeLeft <= 10 ? '#dc3545' : '#28a745',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px',
        }}
      >
        {formatTime(questionTimeLeft)}
      </div>
    </div>
  );

  return (
    <div style={{
      ...cardStyle,
      display: 'flex',
      flexDirection: 'column',
      height: '400px',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '10px'
      }}>
        <div>
          <h3 style={{ margin: 0 }}>
            {isInterviewInProgress ? `Chat with ${interviewer?.name}` : 'Demo Interview'}
          </h3>
          {isInterviewInProgress && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
              {isAiSpeaking ? (
                <>
                  <SoundWave />
                  <span style={{ color: '#28a745', fontSize: '14px' }}>Speaking</span>
                </>
              ) : (
                <>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#28a745',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite',
                  }}></div>
                  <span style={{ color: '#666', fontSize: '14px' }}>Listening</span>
                </>
              )}
            </div>
          )}
        </div>
        {isInterviewInProgress && <TimerDisplay />}
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '10px 5px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {chatMessages.length === 0 && !isInterviewInProgress ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#666',
            marginTop: '50px'
          }}>
            {interviewer ? (
              <div>
                <h3>Interviewer: {interviewer.name}</h3>
                <p>Provider: {interviewer.provider}</p>
                <p>Email: {interviewer.email}</p>
                <p style={{ marginTop: '20px' }}>Click "Start Interview" to begin</p>
              </div>
            ) : (
              <p>Loading interviewer information...</p>
            )}
          </div>
        ) : (
          <>
            {chatMessages.map((message) => (
              <div 
                key={message.id}
                style={{
                  alignSelf: message.sender === 'interviewer' ? 'flex-start' : 'flex-end',
                  maxWidth: '80%',
                  padding: '10px 15px',
                  borderRadius: message.sender === 'interviewer' ? '15px 15px 15px 0' : '15px 15px 0 15px',
                  backgroundColor: message.sender === 'interviewer' ? '#f0f2f5' : '#007bff',
                  color: message.sender === 'interviewer' ? '#333' : 'white',
                }}
              >
                <div>{message.text}</div>
                <div style={{ 
                  fontSize: '11px', 
                  marginTop: '5px', 
                  textAlign: message.sender === 'interviewer' ? 'left' : 'right',
                  opacity: 0.8
                }}>
                  {message.timestamp}
                </div>
              </div>
            ))}
            
            {/* Live speech-to-text display */}
            {transcribedUserResponse && (
              <div style={{
                alignSelf: 'flex-end',
                maxWidth: '80%',
                padding: '10px 15px',
                borderRadius: '15px 15px 0 15px',
                backgroundColor: '#007bff80', // Semi-transparent to indicate "in progress"
                color: 'white',
                position: 'relative',
              }}>
                {transcribedUserResponse}
                <div style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '10px',
                  fontSize: '11px',
                }}>
                  Transcribing...
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Voice Indicator */}
      {isInterviewInProgress && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: isMuted ? '#f8d7da' : '#e8f5e9',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          color: isMuted ? '#721c24' : '#2e7d32',
        }}>
          {isMuted ? (
            <>
              <MicIcon muted={true} />
              <span>Microphone is muted. Click the mic button to speak.</span>
            </>
          ) : (
            <>
              <MicIcon muted={false} />
              <span>Microphone is active. Speak your answer.</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatInterface;