import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import multer from 'multer';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const voiceId = "21m00Tcm4TlvDq8ikWAM";
const modelId = "eleven_multilingual_v2";
const ELEVENLABS_APIS_KEY = process.env.ELEVENLABS_APIS_KEY || '';

export const upload = multer({ dest: 'uploads/' });

export const convertAudioToText = (audioInput: fs.ReadStream) => {
    // Your implementation here

    }

export const getChatResponse = (messageDecoded: string) => {
    // Your implementation here
}

export const storeMessages = (messageDecoded: string, chatResponse: string) => {
    // Your implementation here
}


export const convertTextToSpeech = async (): Promise<Buffer> => {
  console.log("Converting text to speech");
  const chatResponse = "Hello, how are you?";
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      model_id: modelId,
      text: chatResponse,
      voice_settings: {
        similarity_boost: 0.1,
        stability: 0.3
      }
    })
  };

try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, options);
    if (!response.ok) {
        throw new Error('Failed to convert text to speech');
    }
    const data = await response.arrayBuffer();
    return Buffer.from(data);
} catch (err) {
    console.error(err);
    throw err;
}
}
