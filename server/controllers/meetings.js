import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';


dotenv.config();


const rooms = {}; // rooms[i] - users in room i
const socketToRoom = {}; // socketToRoom[s] - room in which s resides
const socketToAlias = {}; // socketToAlias[s] - username of the socket s
const chats = {}; // map from roomId to chatId
const adminUsername = {}; // map from chatId to chatAdmins username
const adminSocket = {}; // map from chatId to chatAdmins socket
const allowedUsersInRoom = {}; // list of allowed users in a room
const emails = {}; // email corr to socketRefs

export const handleSocketEvents = (socket) => {
	// check for the room

	// we map the email of the admin in this join room
	socket.on("join room", (payload) => {
		const roomID = payload.room;
		const useralias = payload.userIdentity;
		const email = payload.email; // uniquely distinguishes the user
		if (rooms[roomID]) {
			// this socket is not admin
			rooms[roomID].push(socket.id);
		} else {
			// this socket is admin
			rooms[roomID] = [socket.id];
			adminSocket[roomID] = socket.id;
			allowedUsersInRoom[roomID] = [email];
			emails[socket.id] = email;
		}
		socketToRoom[socket.id] = roomID;
		socketToAlias[socket.id] = useralias;
		const usersInThisRoom = rooms[roomID].filter((id) => id !== socket.id);

		socket.emit("all other users", usersInThisRoom); // emiting all users except the one who is joining
	});

	// map the email of other users in permission event
	socket.on("permission", (payload) => {
		const userAlias = payload.user;
		const roomId = payload.room;
		const email = payload.email;
		emails[socket.id] = email;

		const allowedUsers = allowedUsersInRoom[roomId];
		if (allowedUsers.includes(email)) {
			// allow directly
			socket.emit("no permit required");
		} else {
			io.to(adminSocket[roomId]).emit("permit?", {
				id: socket.id,
				userAlias: userAlias,
			});
		}
	});

	socket.on("permit status", (payload) => {
		if (payload.allowed) {
			// allow the user to enter into the meeting
			const roomID = socketToRoom[socket.id];
			// add this user to the list of trusted users
			allowedUsersInRoom[roomID].push(emails[payload.id]);
			io.to(payload.id).emit("allowed", chats[roomID]);
		} else {
			io.to(payload.id).emit("denied");
		}
	});

	socket.on("offer", (payload) => {
		io.to(payload.userToSignal).emit("user joined", {
			signal: payload.signal,
			callerID: payload.callerID,
			userIdentity: payload.userIdentity,
		});
	});

	socket.on("answer", (payload) => {
		io.to(payload.callerID).emit("answer", {
			signal: payload.signal,
			id: socket.id,
			userIdentity: payload.userIdentity,
		});
	});

	socket.on("disconnect", () => {
		if (!socketToRoom[socket.id]) return;
		const roomID = socketToRoom[socket.id];
		const useralias = socketToAlias[socket.id];
		let room = rooms[roomID];
		if (room) {
			// remove this user(socket) from the room
			room = room.filter((id) => id !== socket.id);
			rooms[roomID] = room;
			if (rooms[roomID].length === 0) {
				delete rooms[roomID];
				delete adminUsername[chats[roomID]];
				delete adminSocket[roomID];
				delete chats[roomID];
				delete allowedUsersInRoom[roomID];
			}
		}

		// remove this socket id from socketToRoom and socketToAlias collection
		delete socketToRoom[socket.id];
		delete socketToAlias[socket.id];
		delete emails[socket.id];

		// emit event to all other users
		socket.broadcast.emit("user left", { id: socket.id, alias: useralias });
	});
}

export const getMeetingToken = (req, res) => {
	const API_KEY = process.env.VIDEOSDK_API_KEY;
	const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;
  
	const options = { expiresIn: "10m", algorithm: "HS256" };
  
	const payload = {
	  apikey: API_KEY,
	  permissions: ["allow_join", "allow_mod"],
	};
  
	const token = jwt.sign(payload, SECRET_KEY, options);
	const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
	res.json({ videoSdkAuth: token, expiresIn: expirationTime });
  };
  
  export const createMeeting = async (req, res) => {
	const { token, region } = req.body;
	const url = `${process.env.VIDEOSDK_API_ENDPOINT}/api/meetings`;
	console.log(url);
	const headers = { Authorization: token, "Content-Type": "application/json" };
	const data = { region };
  
	try {
	  const response = await axios.post(url, data, { headers });
	  res.json(response.data);
	} catch (error) {
	  console.error("error", error);
	}
  };
  
  export const validateMeeting = (req, res) => {
	const token = req.body.token;
	const meetingId = req.params.meetingId;
  
	const url = `${process.env.VIDEOSDK_API_ENDPOINT}/api/meetings/${meetingId}`;
  
	const headers = { Authorization: token };
  
	axios.post(url, null, { headers })
	  .then((response) => res.json(response.data))
	  .catch((error) => console.error("error", error));
  };

