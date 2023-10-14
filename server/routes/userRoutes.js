import express from 'express'
import { signin, signup, forgotPassword, homepage, logOut, getMeeting, getMeetingByCompany, getMeetings, createMeeting } from '../controllers/user.js'
import { auth } from "../middleware/auth.js";

const router = express.Router()

router.post('/signin', signin)
router.post('/signup', signup)
router.patch('/forgot', forgotPassword);
router.get('/homepage', auth, homepage);
router.get('/logout', logOut);
router.get('/meetings', auth, getMeetings);
router.get('/meeting/:id', auth, getMeeting);
router.get('/meeting/company/:id', auth, getMeetingByCompany);
router.post('/meeting', auth, createMeeting);


export default router