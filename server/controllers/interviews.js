import dotenv from 'dotenv';
import axios from 'axios';


dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL
const VIDEOSDK_TOKEN = process.env.VIDEOSDK_TOKEN
const API_AUTH_URL = null;


export const createMeeting = async (req, res) => {
	const url = `${API_BASE_URL}/v2/rooms`;
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
	  const data = response.data;
	  const status = data ? data.roomId === roomId : false;
	  if(status) {
		  res.status(200).json({status, links: data.links, message: "Valid room code"});
	  } else {
		res.status(200).json({status, links: data.links, message: "Invalid room code"})
	  }
	} catch (error) {
	  console.error("error", error);
	  res.status(400).json({message: String(error)});
	}
  };

  export const fetchRooms = async (req, res) => {
	var url = `${API_BASE_URL}/v2/rooms?page=1&perPage=20`;
	const headers = { 
		Authorization: req.headers.authorization.split(' ')[1],
		 "Content-Type": "application/json"
		 };
	try {
		if(req.query.roomId!==undefined) {
			console.log('roomid present');
			 url= `https://api.videosdk.live/v2/rooms/${req.query.roomId}`;
		}
	  const response = await axios.get(url, { headers });
	  const data = response.data;
	  res.status(200).json(data);
	} catch (error) {
	  console.error("error", error);
	  res.status(400).json({message: String(error)})
	}
  };
  