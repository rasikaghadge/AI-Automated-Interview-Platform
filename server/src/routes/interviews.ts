import express from "express";
import { scheduleMeeting, getMeeting, listInterviewsCandidate, listInterviewsHR, updateMeeting, getInterviewEndTime, updateAllInterviews } from "../controllers/interviews.js";
import InterviewModel from "../models/Interview.js";
import { hrAuth, auth } from "../middleware/auth.js";

const router = express.Router();

// meeting schedule
router.post("/schedule", hrAuth, scheduleMeeting);
router.get("/candidate/:id", auth, listInterviewsCandidate);
router.get("/hr/:id", auth, listInterviewsHR);
router.get("/:id", getMeeting);
router.patch("/update/:id", auth, updateMeeting);

// TODO: add super admin middleware
router.patch("/update", updateAllInterviews);
router.get("/:id/endtime", auth, getInterviewEndTime);

export default router;
