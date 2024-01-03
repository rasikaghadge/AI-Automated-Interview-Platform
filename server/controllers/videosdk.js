import dotenv from 'dotenv';
import axios from 'axios';


dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL
const VIDEOSDK_TOKEN = process.env.VIDEOSDK_TOKEN
const API_AUTH_URL = null;

// function to create videosdk meeting
// this function will used internally or by direct client
export const createMeeting = async (req, res) => {
	const url = `${API_BASE_URL}/v2/rooms`;
  // console.log(url);
	const headers = { 
		Authorization: req.headers.authorization.split(' ')[1],
		"Content-Type": "application/json"
	};
	try {
		const response = await axios.post(url, {}, { headers });
		const { roomId, links } = await response.data;
		// return roomId;
		res.status(200).json({ roomId, links });
	} catch (error) {
		console.error("error", error);
	}
};

// function to validate room code
// Reference: https://docs.videosdk.live/api-reference/realtime-communication/validate-room
export const validateRoom = async (req, res) => {
	const roomId = req.params.roomId;
	const url = `${API_BASE_URL}/v2/rooms/validate/${roomId}`;
	const headers = { 
		Authorization: req.headers.authorization.split(' ')[1],
	 	"Content-Type": "application/json" 
	};
	try {
	  const response = await axios.get(url, { headers });
	  const data = await response.data;
	  const status = data ? data.roomId === roomId : false;
	  if(status) {
		  res.status(200).json({status, data: data, message: "Valid room code"});
      }
	} catch (error) {
	  res.status(400).json({message: "Invalid Room code", err: String(error)});
	}
  };


export const fetchRooms = async (req, res) => {
  const options = {
    method: "GET",
    headers: { 
      Authorization: req.headers.authorization.split(' ')[1],
      "Content-Type": "application/json" 
    },
  };

  let url = `https://api.videosdk.live/v2/rooms?page=1&perPage=20`;

  // If a roomId is provided, modify the url to fetch that specific room
  if (req.params.roomId) {
    url = `https://api.videosdk.live/v2/rooms/${req.params.roomId}`;
  }

  try {
    const response = await axios(url, options);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};


export const deactivateRoom = async (req, res) => {
  const roomId = req.body.roomId;
    if (!roomId) {
        res.status(400).json({message: "Invalid room id or Room Id not provided"})
        return
    }
  const options = {
    method: "POST",
    headers: { 
		Authorization: req.headers.authorization.split(' ')[1],
	 	"Content-Type": "application/json" 
	},
    data: {
      "roomId" : roomId
    },
  };

  const url= `https://api.videosdk.live/v2/rooms/deactivate`;

  try {
    const response = await axios(url, options);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};