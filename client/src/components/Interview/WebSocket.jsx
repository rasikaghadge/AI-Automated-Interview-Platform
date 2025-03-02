export function useWebSocket() {
  const [ws, setWs] = React.useState(null);
  const [messages, setMessages] = useState([]);
  const startWebSocket = () => {
    if (ws) {
      console.log('websocket is already connected');
      return;
    }
    const socket = new WebSocket('ws://localhost:8000/ws');
    socket.onopen = (event) => {
      console.log('socket connected');
    };

    socket.onclose = (event) => {
      console.log('socket closed');
    };

    socket.onmessage = (event) => {
      console.log('received the socket message');
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
