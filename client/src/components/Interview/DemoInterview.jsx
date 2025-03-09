import 'regenerator-runtime/runtime';

import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Button, Avatar, Typography, IconButton } from '@mui/material';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import CallEndIcon from '@mui/icons-material/CallEnd';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { ToastContainer, toast } from 'react-toastify';

const interviewAgentBaseUrl = import.meta.env.VITE_INTERVIEW_AGENT_BASE_URL;

const DemoInterview = () => {
  // States to track whether the user or AI is speaking
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [silenceTimer, setSilenceTimer] = useState(null);

  const location = useLocation();
  const { selectedJobRole, jobDescription } = location.state || {};
  const { sessionId } = useParams();

  // Speech recognition setup
  const {
    transcript: currentTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startInterview = async (selectedJobRole, jobDescription) => {
    try {
      const response = await fetch(`${interviewAgentBaseUrl}/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_role: selectedJobRole,
          job_description: jobDescription,
        }),
      }); 
      console.log(response.ok)

      if (!response.ok) {
        toast.error("This project uses free resources. Limit might be exeeded please try after some time!")
        const errorResponse = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status} - ${errorResponse}`
        );
      }

      const audioBlob = await response.blob();
      playAudio(audioBlob);
    } catch (error) {
      toast.error("This project uses free resources. Limit might be exeeded please try after some time!")
      console.error('Error starting interview:', error);
    }
  };

  // Initialize the session when component renders
  useEffect(() => {
    startInterview(selectedJobRole, jobDescription);
  }, []);

  // Handle speech recognition changes
  useEffect(() => {
    if (listening) {
      setUserSpeaking(true);
      setAiSpeaking(false);

      // Clear any existing silence timer
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
    } else {
      setUserSpeaking(false);
    }
  }, [listening]);

  // Handle transcript changes
  useEffect(() => {
    if (currentTranscript && listening) {
      // User is speaking - update transcript and reset silence detection
      setTranscript(currentTranscript);

      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }

      // Start a new silence detection timer (2 seconds of silence)
      const timer = setTimeout(() => {
        if (transcript.trim() !== '') {
          // If we have some text, assume the user has stopped speaking
          handleSpeechEnd();
        }
      }, 2000);

      setSilenceTimer(timer);
    }
  }, [currentTranscript, listening]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
    };
  }, [silenceTimer]);

  // Toggle microphone
  const toggleMicrophone = () => {
    if (!isMicOn) {
      startListening();
    } else {
      stopListening();
    }
    setIsMicOn(!isMicOn);
  };

  // Start speech recognition
  const startListening = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    resetTranscript();
    setTranscript('');
    SpeechRecognition.startListening({ continuous: true });
    setIsListening(true);
  };

  // Stop speech recognition
  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);

    if (transcript.trim() !== '') {
      handleSpeechEnd();
    }
  };

  const sendMessageToAi = async (audioData) => {
    try {
    const formData = new FormData();
    formData.append('stream', audioData);
    const response = await fetch(`${interviewAgentBaseUrl}/stream`, {
      method: 'POST',
      mode: "no-cors",
      body: formData,
    });

    const audioBlob = await response.blob();
    playAudio(audioBlob);
  } catch {
    toast.error("This project uses free resources. Limit might be exeeded please try after some time!")
  }
  };

  const playAudio = (audioBlob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play().catch((err) => console.error('Error playing audio:', err));
  };
  // Handle when speech ends
  const handleSpeechEnd = () => {
    // Create a text blob to send
    console.log(transcript)
    const textBlob = new Blob([transcript], { type: 'text/plain' });

    // Send the message
    sendMessageToAi(textBlob);

    // Reset for next speech
    resetTranscript();
    setTranscript('');

    // Start AI speaking (if needed)
    handleAiSpeaking();
  };

  // Function to simulate AI speaking
  const handleAiSpeaking = () => {
    setAiSpeaking(true);
    setUserSpeaking(false);
  };

  // Function to stop all speaking
  const stopSpeaking = () => {
    setUserSpeaking(false);
    setAiSpeaking(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background:
          'radial-gradient(circle, rgba(0,0,255,0.3) 0%, rgba(0,0,0,1) 70%)',
        color: 'white',
      }}
    >
      <Avatar
        src="https://via.placeholder.com/150"
        sx={{
          width: 100,
          height: 100,
          mb: 2,
          boxShadow: userSpeaking
            ? '0px 10px 30px 10px rgba(0,0,255,0.8)' // Glow moves downward for user
            : aiSpeaking
            ? '0px -10px 30px 10px rgba(0,255,0,0.8)' // Glow flashes upward for AI
            : '0px 0px 30px 10px rgba(0,0,255,0.5)', // Default glow
          transition: 'box-shadow 0.3s ease', // Smooth transition for effect
        }}
      />
      <Typography variant="h6">Interviewer</Typography>

      {/* Current transcript display */}
      <Typography
        variant="body1"
        sx={{
          mt: 3,
          maxWidth: '80%',
          textAlign: 'center',
          opacity: userSpeaking ? 1 : 0.7,
          transition: 'opacity 0.3s ease',
        }}
      >
        {transcript || (userSpeaking ? 'Listening...' : '')}
      </Typography>

      <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <IconButton
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            onClick={toggleMicrophone}
          >
            {isMicOn ? (
              <MicIcon style={{ color: 'white' }} />
            ) : (
              <MicOffIcon style={{ color: 'white' }} />
            )}
          </IconButton>
          <Typography variant="body2" mt={1}>
            {isMicOn ? 'Mute' : 'Unmute'}
          </Typography>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <IconButton style={{ backgroundColor: 'red' }}>
            <CallEndIcon style={{ color: 'white' }} />
          </IconButton>
          <Typography variant="body2" mt={1}>
            Hang up
          </Typography>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DemoInterview;
