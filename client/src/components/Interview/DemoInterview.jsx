import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Button, Avatar, Typography, IconButton } from "@mui/material";
import MicOffIcon from "@mui/icons-material/MicOff";
import CallEndIcon from "@mui/icons-material/CallEnd";

const DemoInterview = () => {
  // States to track whether the user or AI is speaking
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);

  const location = useLocation()
  const {selectedJobRole, jobDescription} = location.state || {}

  const {sessionId} = useParams()
  console.log(sessionId)
  // Function to simulate user speaking
  const handleUserSpeaking = () => {
    setUserSpeaking(true);
    setAiSpeaking(false);
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "radial-gradient(circle, rgba(0,0,255,0.3) 0%, rgba(0,0,0,1) 70%)",
        color: "white",
      }}
    >
      {/* Avatar with dynamic glowing effect */}
      <Avatar
        src="https://via.placeholder.com/150" // Replace with actual avatar image
        sx={{
          width: 100,
          height: 100,
          mb: 2,
          boxShadow: userSpeaking
            ? "0px 10px 30px 10px rgba(0,0,255,0.8)" // Glow moves downward for user
            : aiSpeaking
            ? "0px -10px 30px 10px rgba(0,255,0,0.8)" // Glow flashes upward for AI
            : "0px 0px 30px 10px rgba(0,0,255,0.5)", // Default glow
          transition: "box-shadow 0.3s ease", // Smooth transition for effect
        }}
      />
      <Typography variant="h6">Interviewer</Typography>
      <Typography variant="h4" fontWeight="bold" mt={1}>
        character.ai
      </Typography>

      {/* Buttons to simulate speaking */}
      <Button
        variant="contained"
        onClick={handleUserSpeaking}
        sx={{ mt: 2, backgroundColor: "white", color: "black", borderRadius: "20px" }}
      >
        Simulate User Speaking
      </Button>
      <Button
        variant="contained"
        onClick={handleAiSpeaking}
        sx={{ mt: 2, backgroundColor: "white", color: "black", borderRadius: "20px" }}
      >
        Simulate AI Speaking
      </Button>
      <Button
        variant="contained"
        onClick={stopSpeaking}
        sx={{ mt: 2, backgroundColor: "white", color: "black", borderRadius: "20px" }}
      >
        Stop Speaking
      </Button>

      <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <IconButton style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
            <MicOffIcon style={{ color: "white" }} />
          </IconButton>
          <Typography variant="body2" mt={1}>
            Mute
          </Typography>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <IconButton style={{ backgroundColor: "red" }}>
            <CallEndIcon style={{ color: "white" }} />
          </IconButton>
          <Typography variant="body2" mt={1}>
            Hang up
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default DemoInterview;