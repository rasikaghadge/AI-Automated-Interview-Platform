import React from "react";

const AISphere = ({ isAiSpeaking }) => {
  return (
    <div className="ai-sphere-container">
      <div className={`ai-sphere ${isAiSpeaking ? "blinking" : ""}`}></div>
      <style>
        {`
          .ai-sphere-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 100px;
          }

          .ai-sphere {
            width: 80px;
            height: 80px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 30%, rgba(0, 128, 255, 0.8) 70%);
            border-radius: 50%;
            box-shadow: 0 0 25px rgba(0, 128, 255, 0.7);
            transition: transform 0.3s ease-in-out;
          }

          .blinking {
            animation: pulse 1s infinite ease-in-out;
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.8); opacity: 0.3; box-shadow: 0 0 50px rgba(0, 128, 255, 1); }
          }
        `}
      </style>
    </div>
  );
};

export default AISphere;
