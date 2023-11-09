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


export const listMeetings = async (req, res) => {
    // Sample data
    const meetings = [
      {
        id: 1,
        title: "Meeting 1",
        description: "This is meeting 1",
        startTime: "2022-01-01T10:00:00Z",
        endTime: "2022-01-01T11:00:00Z",
      },
      {
        id: 2,
        title: "Meeting 2",
        description: "This is meeting 2",
        startTime: "2022-01-02T10:00:00Z",
        endTime: "2022-01-02T11:00:00Z",
      },
      // Add more meetings as needed
    ];
  
    res.json(meetings);
  };

  export const getMeeting = async (req, res) => {
    // Sample data
    const meeting = {
      id: 1,
      title: "Meeting 1",
      description: "This is meeting 1",
      startTime: "2022-01-01T10:00:00Z",
      endTime: "2022-01-01T11:00:00Z",
      scheduledBy: "User 1",
    };
  
    res.json(meeting);
  };

  export const scheduleMeeting = async (req, res) => {
    // Get meeting details from request body
    const { title, description, startTime, endTime, user } = req.body;
  
    // Sample data
    const meeting = {
      id: Math.floor(Math.random() * 1000), // Generate a random id for the meeting
      title,
      description,
      startTime,
      endTime,
      user
    };
    // Send the meeting data as a response
    res.json(meeting);
  };