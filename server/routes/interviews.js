import express from "express";
import { scheduleMeeting, listMeetings, getMeeting } from "../controllers/interviews.js";
import { hrAuth } from "../middleware/auth.js";
import { createMeeting, validateRoom, fetchRooms, deactivateRoom } from "../controllers/videosdk.js";

const router = express.Router();

// videosdk routes
router.post("/create",hrAuth, createMeeting);
router.get("/validate/:roomId", validateRoom);
router.get('/rooms/:roomId', fetchRooms);
router.get('/rooms',hrAuth, fetchRooms);
router.post('/deactivate', hrAuth, deactivateRoom);

// meeting schedule
router.post("/schedule", scheduleMeeting);
router.get("/list", listMeetings);
router.get("/:meetingId", getMeeting);

export default router;
