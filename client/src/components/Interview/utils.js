export const checkPermissions = async (type) => {
    try {
      const result = await navigator.permissions.query({ name: type });
      return result.state;
    } catch (err) {
      console.warn(`Could not check ${type} permission:`, err);
      return 'prompt';
    }
  };
  
  export const startAudioStream = async (audioStreamRef) => {
    const micPermission = await checkPermissions('microphone');
    if (micPermission === 'denied') {
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
  
  export const startVideoStream = async (videoStreamRef) => {
    const cameraPermission = await checkPermissions('camera');
    if (cameraPermission === 'denied') {
      alert('Camera access denied. Please enable it in browser settings.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoStreamRef.current = stream;
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };
  
  export const stopAudioStream = (audioStreamRef) => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
  };
  
  export const stopVideoStream = (videoStreamRef) => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop());
      videoStreamRef.current = null;
    }
  };
  
  export const addMessageToChat = (message, sender, setChatMessages, chatContainerRef) => {
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: sender,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);
  
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };
  