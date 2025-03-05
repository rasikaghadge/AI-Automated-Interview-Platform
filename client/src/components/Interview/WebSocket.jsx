import { useState } from 'react';

export function useWebSocket() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const startWebSocket = (addMessageToChat) => {
    if (ws) {
      console.log('websocket is already connected');
      return;
    }
    const socket = new WebSocket('ws://localhost:8000/ws');
    socket.onopen = (event) => {
      console.log(event)
      console.log('socket connected');
    };

    socket.onclose = (event) => {
      console.log('socket closed');
    };

    socket.onmessage = async (event) => {
      console.log(event.data);
    
      if (event.data instanceof Blob) {
        const audioBlob = event.data;
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play().catch((err) => console.error("Error playing audio:", err));
        addMessageToChat(audioUrl, "interviewer", "audio")
      }
    };
    
    setWs(socket);
  };

  const sendMessage = (message) => {
    if (ws && readyState.OPEN) {
      ws.send(message);
    } else {
      console.log('websocket is not open');
    }
  };

  return { startWebSocket, sendMessage, messages };
}
