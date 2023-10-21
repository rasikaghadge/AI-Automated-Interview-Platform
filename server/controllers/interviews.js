import dotenv from 'dotenv';
import axios from 'axios';


dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL
const VIDEOSDK_TOKEN = process.env.VIDEOSDK_TOKEN
const API_AUTH_URL = null;

export const getToken = async () => {
	if (VIDEOSDK_TOKEN && API_AUTH_URL) {
		throw new Error("Provide only ONE PARAMETER - either Token or Auth API");
	} else if (VIDEOSDK_TOKEN) {
		return VIDEOSDK_TOKEN;
	} else if (API_AUTH_URL) {
		try {
			const response = await fetch(`${API_AUTH_URL}/get-token`);
			const { token } = await response.json();
			console.log(token);
			return token;
		} catch (error) {
			console.error("error", error);
		}
	} else {
		throw new Error("Please add a token or Auth Server URL");
	}
};

export const createMeeting = async (req, res) => {
	const url = `${API_BASE_URL}/v2/rooms`;
	const headers = { Authorization: VIDEOSDK_TOKEN, "Content-Type": "application/json" };
	try {
		const response = await fetch(url, { method: "POST", headers });
		const { roomId } = await response.json();
		// return roomId;
		res.status(200).json({ roomId });
	} catch (error) {
		console.error("error", error);
	}
};

export const validateMeeting = async (req, res) => {
	console.log(req.params);
	const meetingId = req.params.meetingId;
	const url = `${API_BASE_URL}/v2/rooms/validate/${meetingId}`;
	const headers = { Authorization: VIDEOSDK_TOKEN, "Content-Type": "application/json" };
	try {
		const response = await fetch(url, { method: "GET", headers });
		const result = await response.json();
		// return result ? result.roomId === meetingId : false;
		res.status(200).json({ result, valid: result.roomId === meetingId });
	} catch (error) {
		res.status(500).json({ error });
	}
};