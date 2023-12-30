import express from "express";
import { scheduleMeeting, listMeetings, getMeeting, listInterviewsCandidate, listInterviewsHR } from "../controllers/interviews.js";
import { hrAuth, auth } from "../middleware/auth.js";
import { createMeeting, validateRoom, fetchRooms, deactivateRoom } from "../controllers/videosdk.js";

const router = express.Router();

// videosdk routes
router.post("/create",hrAuth, createMeeting);
router.get("/validate/:roomId", validateRoom);
router.get('/rooms/:roomId', fetchRooms);
router.get('/rooms',hrAuth, fetchRooms);
router.post('/deactivate', hrAuth, deactivateRoom);

// meeting schedule
router.post("/schedule", hrAuth, scheduleMeeting);
router.get("/list", auth, listMeetings);
router.get("/candidate/:id", auth, listInterviewsCandidate);
router.get("/hr/:id", auth, listInterviewsHR);
router.get("/:id", getMeeting);

export default router;
