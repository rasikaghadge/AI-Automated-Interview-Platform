import React, { useState, useEffect, useRef } from 'react';
import Evaluation from '../Evaluation/Evaluation';
import { useNavigate } from 'react-router-dom';
import InterviewControls from './InterviewControls';
import VideoSection from './VideoSection';
import ChatInterface from './ChatInterface';
import { INTERVIEWERS, demoQuestions, demoResponses } from './interviewData';
import AISphere from './AiSphere';

const DemoInterview = () => {
  const navigate = useNavigate();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionTimeLeft, setquestionTimeLeft] = useState(32); // 32 seconds
  const [interviewTimeLeft, setInterviewTimeLeft] = useState(1800) // 30 min
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcribedUserResponse, setTranscribedUserResponse] = useState("");
  
  const videoRef = useRef(null);
  const audioStreamRef = useRef(null);
  const videoStreamRef = useRef(null);
  const chatContainerRef = useRef(null);

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [interviewer, setInterviewer] = useState(null);

  const isInterviewInProgress = interviewStarted && !interviewCompleted;

  const handleOnEvaluationClose = () => {
    setIsModelOpen(false);
    navigate("/");
  };

  const handleInterviewStartButtonClick = (event) => {
    if (event.target.innerText === 'Start Interview') {
      setInterviewStarted(true);
      setIsTimerRunning(true);
      
      // Add first question to chat and simulate AI speaking
      setTimeout(() => {
        setIsAiSpeaking(true);
        setTimeout(() => {
          addMessageToChat(demoQuestions[currentQuestion], 'interviewer');
          setIsAiSpeaking(false);
        }, 2000);
      }, 500);
      
    } else {
      if (window.confirm('Are you sure you want to exit?')) {
        setInterviewCompleted(true);
        setIsModelOpen(true);
      }
    }
  };

  useEffect(() => {
    const randomInterviewer =
      INTERVIEWERS[Math.floor(Math.random() * INTERVIEWERS.length)];
    setInterviewer(randomInterviewer);
  }, []);

  // Add message to chat
  const addMessageToChat = (message, sender) => {
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: sender, // 'interviewer' or 'user'
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Scroll to bottom of chat
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  // Simulate user speaking response
  const simulateUserSpeaking = () => {
    // Clear any previous transcription
    setTranscribedUserResponse("");
    
    // Simulate real-time transcription with progressive text updates
    const fullResponse = demoResponses[currentQuestion];
    const words = fullResponse.split(" ");
    let currentIndex = 0;
    
    const transcriptionInterval = setInterval(() => {
      if (currentIndex < words.length) {
        setTranscribedUserResponse(prev => 
          prev + (prev ? " " : "") + words[currentIndex]
        );
        currentIndex++;
      } else {
        clearInterval(transcriptionInterval);
        // After full transcription, add to chat
        setTimeout(() => {
          addMessageToChat(fullResponse, 'user');
        }, 500);
      }
    }, 300); // Simulate natural speaking pace
  };

  const checkPermissions = async (type) => {
    try {
      const result = await navigator.permissions.query({ name: type });
      return result.state;
    } catch (err) {
      console.warn(`Could not check ${type} permission:`, err);
      return 'prompt';
    }
  };

  // Function to access microphone
  const startAudioStream = async () => {
    const micPermission = await checkPermissions('microphone');
    if (micPermission === 'denied') {
      setIsMuted(true);
      alert('Microphone access denied. Please enable it in browser settings.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  // Function to access camera (optional)
  const startVideoStream = async () => {
    const cameraPermission = await checkPermissions('camera');
    if (cameraPermission === 'denied') {
      setIsVideoOff(true);
      alert('Camera access denied. Please enable it in browser settings.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      videoStreamRef.current = stream;
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopAudioStream = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
  };

  const stopVideoStream = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop());
      videoStreamRef.current = null;
    }
  };

  useEffect(() => {
    if (!isVideoOff) {
      startVideoStream();
    } else {
      stopVideoStream();
    }
  }, [isVideoOff]);

  useEffect(() => {
    if (!isMuted) {
      startAudioStream();
    } else {
      stopAudioStream();
    }
  }, [isMuted]);

  // Timer Effect
  useEffect(() => {
    let timer;
    if (isTimerRunning && questionTimeLeft > 0) {
      timer = setInterval(() => {
        setquestionTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (questionTimeLeft === 0) {
      // Auto-move to next question when time is up
      handleNextQuestion();
    }
    return () => clearInterval(timer);
  }, [questionTimeLeft, isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = () => {
    if (currentQuestion < demoQuestions.length - 1) {
      // First, simulate user's response to current question if not yet added
      if (!chatMessages.find(msg => 
        msg.sender === 'user' && 
        msg.text.includes(demoResponses[currentQuestion].substring(0, 15))
      )) {
        simulateUserSpeaking();
        
        // Short delay before moving to next question
        setTimeout(() => {
          proceedToNextQuestion();
        }, 3000);
      } else {
        proceedToNextQuestion();
      }
    }
  };

  const proceedToNextQuestion = () => {
    setCurrentQuestion((curr) => curr + 1);
    setquestionTimeLeft(32); // Reset timer for new question
    setIsTimerRunning(true);
    setTranscribedUserResponse(""); // Clear any current transcription
    
    // Simulate AI speaking the next question
    setIsAiSpeaking(true);
    setTimeout(() => {
      // After a delay, add the next question to chat
      const nextQuestion = demoQuestions[currentQuestion + 1];
      addMessageToChat(nextQuestion, 'interviewer');
      setIsAiSpeaking(false);
    }, 2000);
  };

  // For demo purposes, let's simulate the user's speech input when they click mic button
  const simulateSpeechInput = () => {
    if (!isMuted && isInterviewInProgress) {
      simulateUserSpeaking();
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '20px',
      }}
    >
      <style>
        {`
          @keyframes soundWave {
            0% { height: 20%; }
            100% { height: 100%; }
          }
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
        `}
      </style>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Video Feed Section */}
        <VideoSection 
          videoRef={videoRef}
          isVideoOff={isVideoOff}
          setIsVideoOff={setIsVideoOff}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          simulateSpeechInput={simulateSpeechInput}
        />

        {/* Chat Interface */}
        <ChatInterface 
          chatContainerRef={chatContainerRef}
          chatMessages={chatMessages}
          interviewer={interviewer}
          isInterviewInProgress={isInterviewInProgress}
          isAiSpeaking={isAiSpeaking}
          questionTimeLeft={questionTimeLeft}
          formatTime={formatTime}
          transcribedUserResponse={transcribedUserResponse}
          isMuted={isMuted}
        />
      </div>

      {/* Interview Controls */}
      <InterviewControls 
        isInterviewInProgress={isInterviewInProgress}
        currentQuestion={currentQuestion}
        demoQuestions={demoQuestions}
        handleNextQuestion={handleNextQuestion}
        handleInterviewStartButtonClick={handleInterviewStartButtonClick}
      />

      {/* Interview Tips */}
      {!isInterviewInProgress && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            margin: '20px auto',
            maxWidth: '1200px',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '15px',
            }}
          >
            Interview Tips
          </h3>
          <ul style={{ color: '#444', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>
              Speak clearly and maintain good eye contact with the camera
            </li>
            <li style={{ marginBottom: '8px' }}>
              Take a moment to gather your thoughts before answering
            </li>
            <li style={{ marginBottom: '8px' }}>
              Provide specific examples to support your answers
            </li>
            <li style={{ marginBottom: '8px' }}>
              Keep your responses focused and concise
            </li>
          </ul>
        </div>
      )}

      {isInterviewInProgress && <AISphere isAiSpeaking={isAiSpeaking} />}

      {/* Evaluation Modal */}
      {isModelOpen && <Evaluation evaluationData={"some data to be displayed\nhow I can modify this"} onClose={handleOnEvaluationClose}/>}
    </div>
  );
};

export default DemoInterview;