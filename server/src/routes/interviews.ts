import express from "express";
import { scheduleMeeting, getMeeting, listInterviewsCandidate, listInterviewsHR } from "../controllers/interviews.js";
import { hrAuth, auth } from "../middleware/auth.js";

const router = express.Router();

// meeting schedule
router.post("/schedule", hrAuth, scheduleMeeting);
router.get("/candidate/:id", auth, listInterviewsCandidate);
router.get("/hr/:id", auth, listInterviewsHR);
router.get("/:id", getMeeting);

export default router;
