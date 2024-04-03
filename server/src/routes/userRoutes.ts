import express from 'express'
import { signin, signup, forgotPassword, refresh } from '../controllers/user.js'
import { auth } from "../middleware/auth.js";

const router = express.Router()

router.post('/signin', signin)
router.post('/signup', signup)
router.post('/refresh', refresh);
router.patch('/forgot', forgotPassword);


export default router