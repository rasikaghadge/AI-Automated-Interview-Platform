import React from 'react';

const InterviewControls = ({
  isInterviewInProgress,
  currentQuestion,
  demoQuestions,
  handleNextQuestion,
  handleInterviewStartButtonClick
}) => {
  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: '500',
    transition: 'background-color 0.3s',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    margin: '20px auto',
    maxWidth: '1200px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  return (
    <div style={cardStyle}>
      <div>
        <p style={{ margin: 0, color: '#666' }}>
          {isInterviewInProgress ? `Question ${currentQuestion + 1} of ${demoQuestions.length}` : 'Interview not started'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        {isInterviewInProgress && (
          <button
            onClick={handleNextQuestion}
            style={{
              ...buttonStyle,
              backgroundColor: '#6c757d',
            }}
          >
            Next Question
          </button>
        )}
        <button
          onClick={handleInterviewStartButtonClick}
          style={{
            ...buttonStyle,
            backgroundColor: isInterviewInProgress ? '#f11414' : '#007bff',
          }}
        >
          {isInterviewInProgress ? 'Exit Interview' : 'Start Interview'}
        </button>
      </div>
    </div>
  );
};

export default InterviewControls;