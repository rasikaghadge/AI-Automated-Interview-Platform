import React, { useState } from 'react';

const DemoInterview = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const demoQuestions = [
    "Tell me about your experience with React development.",
    "How do you handle state management in large applications?",
    "Can you explain a challenging problem you've solved recently?",
    "What's your approach to writing clean and maintainable code?",
  ];

  const nextQuestion = () => {
    if (currentQuestion < demoQuestions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    }
  };

  const buttonStyle = {
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    fontWeight: "500",
    transition: "background-color 0.3s",
  };

  const iconButtonStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s",
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    margin: "10px 0",
  };

  // SVG icons
  const MicIcon = ({ muted }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {muted ? (
        <>
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </>
      ) : (
        <>
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </>
      )}
    </svg>
  );

  const VideoIcon = ({ off }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {off ? (
        <>
          <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </>
      ) : (
        <>
          <path d="M23 7l-7 5 7 5V7z"></path>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </>
      )}
    </svg>
  );

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f0f0f0",
      padding: "20px",
    }}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
      }}>
        {/* Video Feed Section */}
        <div style={cardStyle}>
          <div style={{
            aspectRatio: "16/9",
            backgroundColor: "#1a1a1a",
            borderRadius: "8px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {isVideoOff ? (
              <div style={{ color: "white", textAlign: "center" }}>
                <VideoIcon off={true} />
                <p style={{ marginTop: "10px" }}>Camera is off</p>
              </div>
            ) : (
              <div style={{ 
                width: "100%", 
                height: "100%", 
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}>
                Camera Preview
              </div>
            )}
          </div>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                ...iconButtonStyle,
                backgroundColor: isMuted ? "#dc3545" : "#6c757d",
                color: "white",
              }}
              title={isMuted ? "Unmute" : "Mute"}
            >
              <MicIcon muted={isMuted} />
            </button>
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              style={{
                ...iconButtonStyle,
                backgroundColor: isVideoOff ? "#dc3545" : "#6c757d",
                color: "white",
              }}
              title={isVideoOff ? "Start Video" : "Stop Video"}
            >
              <VideoIcon off={isVideoOff} />
            </button>
          </div>
        </div>

        {/* Interview Section */}
        <div style={cardStyle}>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
              AI Interviewer
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "10px",
                height: "10px",
                backgroundColor: "#28a745",
                borderRadius: "50%",
                animation: "pulse 2s infinite",
              }}></div>
              <span style={{ color: "#666" }}>AI is listening...</span>
            </div>
          </div>

          <div style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            minHeight: "150px",
          }}>
            <p style={{ fontWeight: "600", marginBottom: "10px" }}>Current Question:</p>
            <p style={{ color: "#333" }}>{demoQuestions[currentQuestion]}</p>
          </div>

          <div>
            <button
              onClick={nextQuestion}
              style={{
                ...buttonStyle,
                width: "100%",
                marginBottom: "10px",
              }}
            >
              Next Question
            </button>
            <p style={{ textAlign: "center", color: "#666", fontSize: "14px" }}>
              Question {currentQuestion + 1} of {demoQuestions.length}
            </p>
          </div>
        </div>
      </div>

      {/* Interview Tips */}
      <div style={{
        ...cardStyle,
        maxWidth: "1200px",
        margin: "20px auto",
      }}>
        <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "15px" }}>
          Interview Tips
        </h3>
        <ul style={{ color: "#444" }}>
          <li style={{ marginBottom: "8px" }}>• Speak clearly and maintain good eye contact with the camera</li>
          <li style={{ marginBottom: "8px" }}>• Take a moment to gather your thoughts before answering</li>
          <li style={{ marginBottom: "8px" }}>• Provide specific examples to support your answers</li>
          <li style={{ marginBottom: "8px" }}>• Keep your responses focused and concise</li>
        </ul>
      </div>
    </div>
  );
};

export default DemoInterview;