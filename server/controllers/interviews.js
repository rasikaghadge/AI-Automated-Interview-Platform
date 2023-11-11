import dotenv from 'dotenv';
import axios from 'axios';


dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL
const VIDEOSDK_TOKEN = process.env.VIDEOSDK_TOKEN
const API_AUTH_URL = null;


  export const fetchRooms = async (req, res) => {
	var url = `${API_BASE_URL}/v2/rooms?page=1&perPage=20`;
	const headers = { 
		Authorization: req.headers.authorization.split(' ')[1],
		 "Content-Type": "application/json"
		 };
	try {
		if(req.query.roomId!==undefined) {
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
