import express from "express";
import { getCandidateInterviewScore, getInterviewEndTime, getMeeting, listInterviewsCandidate, listInterviewsHR, scheduleMeeting, updateAllInterviews, updateMeeting, updateHiringStatus } from "../controllers/interviews.js";
import { auth, hrAuth } from "../middleware/auth.js";


const router = express.Router();

// meeting schedule
router.post("/schedule", hrAuth, scheduleMeeting);
router.get("/candidate/:id", auth, listInterviewsCandidate);
router.get("/hr/:id", auth, listInterviewsHR);
router.get("/:id", getMeeting);
router.patch("/update/:id", auth, updateMeeting);

// TODO: add super admin middleware
router.patch("/update", updateAllInterviews);
router.patch("/hiring/:id", updateHiringStatus);
router.get("/:id/endtime", auth, getInterviewEndTime);
router.get("/score/:id", hrAuth, getCandidateInterviewScore);

export default router;
