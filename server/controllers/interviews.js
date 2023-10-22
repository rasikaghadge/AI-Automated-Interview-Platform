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
		console.log(response)
		const { roomId, links } = await response.data;
		// return roomId;
		res.status(200).json({ roomId, links });
	} catch (error) {
		console.error("error", error);
	}
};

